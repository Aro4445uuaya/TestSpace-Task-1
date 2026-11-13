const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();

const { MongoClient } = require("mongodb");
const { randomUUID, randomInt, randomBytes, createCipheriv, createDecipheriv, scryptSync } = require("crypto");
const jwt = require("jsonwebtoken");
const authRoutes = require("./routes/auth");
const pool = require("./config/mysql");
const { rateLimit } = require("express-rate-limit");

// ======================================
// APPLICATION CONFIGURATION
// ======================================

const app = express();

// ======================================
// RATE LIMITING CONFIGURATION
// ======================================

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many authentication attempts. Please try again later."
    }
});



const PORT = process.env.PORT || 3000;

const DATABASE_NAME = "testspace";

// ======================================
// MONGODB CONFIGURATION
// ======================================

if (!process.env.MONGO_URI) {
    console.error("ERROR: MONGO_URI is missing in .env");
    process.exit(1);
}

if (
    !process.env.MONGO_URI.startsWith("mongodb://") &&
    !process.env.MONGO_URI.startsWith("mongodb+srv://")
) {
    console.error("ERROR: Invalid MongoDB connection URI.");
    process.exit(1);
}

const client = new MongoClient(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10
});

let db;

// Store owner-recoverable workspace passwords encrypted at rest. The key is
// derived from a stable server-side secret and is never sent to the browser.
function getWorkspaceCredentialKey() {
    const secret = process.env.WORKSPACE_CREDENTIALS_SECRET || process.env.JWT_SECRET;
    if (!secret) throw new Error("WORKSPACE_CREDENTIALS_SECRET or JWT_SECRET is required");
    return scryptSync(secret, "testspace-workspace-credentials-v1", 32);
}

function encryptWorkspacePassword(password) {
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", getWorkspaceCredentialKey(), iv);
    const encrypted = Buffer.concat([cipher.update(password, "utf8"), cipher.final()]);
    return { iv: iv.toString("base64"), tag: cipher.getAuthTag().toString("base64"), data: encrypted.toString("base64") };
}

function decryptWorkspacePassword(payload) {
    if (!payload?.iv || !payload?.tag || !payload?.data) return null;
    try {
        const decipher = createDecipheriv("aes-256-gcm", getWorkspaceCredentialKey(), Buffer.from(payload.iv, "base64"));
        decipher.setAuthTag(Buffer.from(payload.tag, "base64"));
        return Buffer.concat([decipher.update(Buffer.from(payload.data, "base64")), decipher.final()]).toString("utf8");
    } catch {
        console.error("Workspace password decryption failed. Check that the server credential secret has not changed.");
        return null;
    }
}

function generateWorkspaceId() {
    return `TS-${randomInt(100000, 1000000)}`;
}

// ======================================
// MIDDLEWARE
// ======================================

app.use(cors());
app.use(express.json());
app.use("/api", apiLimiter);

// AUTHENTICATION ROUTES
app.use("/api/auth", authLimiter, authRoutes);

const authenticateToken = require("./middleware/auth");

// Guest tokens are deliberately accepted only by student endpoints.
// They cannot access teacher/workspace-management APIs.
function authenticateStudentToken(req, res, next) {
    try {
        const header = req.headers.authorization || "";
        if (!header.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Student session required. Join the workspace again." });
        }
        const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET, { issuer: "testspace" });
        if (decoded.type === "guest" && decoded.workspaceId && decoded.guestId) {
            req.student = { studentId: String(decoded.guestId), workspaceId: String(decoded.workspaceId), guest: true };
            return next();
        }
        // Existing logged-in student tokens remain supported on student endpoints.
        if (decoded.sub && decoded.type !== "guest") {
            req.student = { studentId: String(decoded.sub), email: decoded.email || "", guest: false };
            return next();
        }
        return res.status(401).json({ success: false, message: "Invalid student session." });
    } catch {
        return res.status(401).json({ success: false, message: "Student session expired. Please join again." });
    }
}

async function getActiveWorkspace(workspaceId) {
    const workspace = await db.collection("workspaces").findOne({ workspaceId, status: "active" });
    if (!workspace) return null;
    if (workspace.expiresAt && new Date(workspace.expiresAt).getTime() <= Date.now()) {
        await deleteExpiredWorkspace(workspaceId);
        return null;
    }
    return workspace;
}

async function deleteExpiredWorkspace(workspaceId) {
    // Archive a private, owner-only report BEFORE deleting operational workspace data.
    // The archive intentionally contains only report data needed for the PDF.
    const workspace = await db.collection("workspaces").findOne({
        workspaceId,
        expiresAt: { $lte: new Date() }
    });
    if (!workspace) return;

    const [questions, submissions, members] = await Promise.all([
        db.collection("workspaceQuestions").find({ workspaceId }).toArray(),
        db.collection("examSubmissions").find({ workspaceId }).sort({ submittedAt: -1 }).toArray(),
        db.collection("workspaceMembers").find({ workspaceId }).project({ studentId: 1, dno: 1 }).toArray()
    ]);

    const dnoByStudentId = new Map(members.map(member => [String(member.studentId), member.dno || ""]));
    const reportSubmissions = submissions.map(item => ({
        ...item,
        dno: item.dno || dnoByStudentId.get(String(item.studentId)) || ""
    }));

    await db.collection("workspaceReports").updateOne(
        { workspaceId, ownerId: String(workspace.teacherId) },
        { $setOnInsert: {
            workspaceId,
            ownerId: String(workspace.teacherId),
            workspaceName: workspace.workspaceName,
            description: workspace.description || "",
            createdAt: workspace.createdAt,
            expiredAt: workspace.expiresAt,
            examDurationMinutes: workspace.examDurationMinutes || 30,
            questions,
            submissions: reportSubmissions,
            archivedAt: new Date()
        } },
        { upsert: true }
    );

    // D.no uniqueness is workspace-scoped. Expired workspace memberships are
    // removed with the workspace, so the same D.no can join another workspace.
    await Promise.all([
        db.collection("workspaceQuestions").deleteMany({ workspaceId }),
        db.collection("workspaceMembers").deleteMany({ workspaceId }),
        db.collection("examSubmissions").deleteMany({ workspaceId }),
        db.collection("sessionAnalytics").deleteMany({ workspaceId }),
        db.collection("workspaces").deleteOne({ workspaceId, expiresAt: { $lte: new Date() } })
    ]);
}

async function cleanupExpiredWorkspaces() {
    if (!db) return;
    const expired = await db.collection("workspaces")
        .find({ expiresAt: { $lte: new Date() } }, { projection: { workspaceId: 1 } })
        .toArray();
    for (const item of expired) await deleteExpiredWorkspace(item.workspaceId);
}


app.get("/api/protected-test", authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: "JWT authentication working!",
        user: req.user
    });
});

// ======================================
// HOME API
// ======================================

app.get("/", (req, res) => {
    res.json({
        application: "TestSpace",
        message: "TestSpace API is running!",
        status: "success"
    });
});

// ======================================
// HEALTH CHECK API
// ======================================

app.get("/api/health", (req, res) => {
    res.json({
        application: "TestSpace",
        status: "OK",
        message: "Backend is working correctly!"
    });
});

// ======================================
// DATABASE STATUS API
// ======================================

app.get("/api/db-status", async (req, res) => {
    try {
        if (!db) {
            return res.status(503).json({
                status: "Disconnected",
                message: "Database is not initialized"
            });
        }

        await db.command({ ping: 1 });

        res.json({
            application: "TestSpace",
            database: "MongoDB Atlas",
            status: "Connected"
        });

    } catch (error) {
        console.error("Database Status Error:", error);

        res.status(500).json({
            status: "Disconnected",
            message: "Database connection failed"
        });
    }
});

// ======================================
// OWNER-ONLY ARCHIVED REPORTS API
// ======================================
app.get("/api/reports", authenticateToken, async (req, res) => {
    try {
        const reports = await db.collection("workspaceReports")
            .find({ ownerId: String(req.user.userId) })
            .sort({ archivedAt: -1 })
            .project({ questions: 1, submissions: 1, workspaceId: 1, workspaceName: 1, description: 1, createdAt: 1, expiredAt: 1, examDurationMinutes: 1, archivedAt: 1 })
            .toArray();
        return res.json({ success: true, reports });
    } catch (error) {
        console.error("Archived Reports Error:", error);
        return res.status(500).json({ success: false, message: "Failed to load archived reports" });
    }
});

// ======================================
// CREATE WORKSPACE API
// ======================================

app.post("/api/workspaces", authenticateToken, async (req, res) => {
    try {
        const {
            workspaceName,
            description,
            password,
            examDurationMinutes,
            workspaceDurationMinutes
        } = req.body || {};

        if (
            !workspaceName ||
            typeof workspaceName !== "string" ||
            !workspaceName.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Workspace name is required"
            });
        }

        if (
            typeof password !== "string" ||
            password.length < 6
        ) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters"
            });
        }

        if (Buffer.byteLength(password, "utf8") > 72) {
            return res.status(400).json({
                success: false,
                message: "Password must not exceed 72 bytes"
            });
        }

        const examMinutes = Number(examDurationMinutes);
        const workspaceMinutes = Number(workspaceDurationMinutes);
        if (!Number.isInteger(examMinutes) || examMinutes < 1 || examMinutes > 600 ||
            !Number.isInteger(workspaceMinutes) || workspaceMinutes < 1 || workspaceMinutes > 525600) {
            return res.status(400).json({ success: false, message: "Enter valid exam and workspace durations." });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const passwordEncrypted = encryptWorkspacePassword(password);
        const createdAt = new Date();
        const expiresAt = new Date(createdAt.getTime() + workspaceMinutes * 60 * 1000);

        const newWorkspace = {
            workspaceId: generateWorkspaceId(),

            workspaceName: workspaceName.trim(),

            description:
                typeof description === "string"
                    ? description.trim()
                    : "",

            teacherId: String(req.user.userId),

            passwordHash,
            passwordEncrypted,

            createdAt,
            examDurationMinutes: examMinutes,
            workspaceDurationMinutes: workspaceMinutes,
            expiresAt,

            status: "active"
        };

        let result;
        // Retry rare six-digit collisions; MongoDB's unique index is the final guard.
        for (let attempt = 0; attempt < 10; attempt += 1) {
            try {
                result = await db.collection("workspaces").insertOne(newWorkspace);
                break;
            } catch (insertError) {
                if (insertError?.code !== 11000 || attempt === 9) throw insertError;
                newWorkspace.workspaceId = generateWorkspaceId();
            }
        }

        res.status(201).json({
            success: true,

            message: "Workspace created successfully!",

            workspace: {
                workspaceId: newWorkspace.workspaceId,
                workspaceName: newWorkspace.workspaceName,
                description: newWorkspace.description,
                teacherId: newWorkspace.teacherId,
                createdAt: newWorkspace.createdAt,
                examDurationMinutes: newWorkspace.examDurationMinutes,
                workspaceDurationMinutes: newWorkspace.workspaceDurationMinutes,
                expiresAt: newWorkspace.expiresAt,
                status: newWorkspace.status,
                _id: result.insertedId
            }
        });

    } catch (error) {
        console.error("Create Workspace Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create workspace"
        });
    }
});



// ======================================
// UPDATE WORKSPACE EXPIRY API
// JWT PROTECTED + OWNER ONLY
// ======================================
app.put("/api/workspaces/:workspaceId/settings", authenticateToken, async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const expiresAt = new Date(req.body?.expiresAt);

        if (!req.body?.expiresAt || Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() <= Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Choose a valid future workspace expiry date and time."
            });
        }

        const filter = {
            workspaceId,
            teacherId: String(req.user.userId),
            status: "active"
        };
        const workspace = await db.collection("workspaces").findOne(filter, {
            projection: { workspaceId: 1, createdAt: 1 }
        });

        if (!workspace) {
            return res.status(404).json({
                success: false,
                message: "Workspace not found or access denied."
            });
        }

        const createdAt = workspace.createdAt ? new Date(workspace.createdAt) : new Date();
        const workspaceDurationMinutes = Math.max(
            1,
            Math.ceil((expiresAt.getTime() - createdAt.getTime()) / 60000)
        );

        await db.collection("workspaces").updateOne(filter, {
            $set: { expiresAt, workspaceDurationMinutes }
        });

        return res.json({
            success: true,
            message: "Workspace expiry updated successfully.",
            workspace: { workspaceId, expiresAt, workspaceDurationMinutes }
        });
    } catch (error) {
        console.error("Update Workspace Expiry Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update workspace expiry."
        });
    }
});

// ======================================
// JOIN WORKSPACE API
// ======================================


app.post("/api/workspaces/join", async (req, res) => {
    try {
        const { workspaceId, password, studentName, dno } = req.body || {};
        if (typeof workspaceId !== "string" || !workspaceId.trim() ||
            typeof password !== "string" || !password ||
            typeof studentName !== "string" || !studentName.trim() ||
            typeof dno !== "string" || !dno.trim()) {
            return res.status(400).json({ success: false, message: "Workspace ID, password, student name and D.no are required." });
        }
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ success: false, message: "Authentication configuration error." });
        }

        const cleanWorkspaceId = workspaceId.trim();
        const cleanDno = dno.trim();
        const cleanStudentName = studentName.trim().replace(/\s+/g, " ").slice(0, 100);
        const normalizedDno = cleanDno.toLocaleUpperCase("en-US").replace(/\s+/g, "");
        const workspace = await getActiveWorkspace(cleanWorkspaceId);
        if (!workspace) {
            return res.status(404).json({ success: false, message: "Workspace not found or its duration has expired." });
        }
        if (!workspace.passwordHash || !(await bcrypt.compare(password, workspace.passwordHash))) {
            return res.status(401).json({ success: false, message: "Incorrect workspace password." });
        }

        const guestId = randomUUID();
        const joinedAt = new Date();
        // The unique compound index allows the same D.no in different workspaces,
        // while preventing a second join with that D.no in this workspace.
        try {
            await db.collection("workspaceMembers").insertOne({
                workspaceId: cleanWorkspaceId,
                studentId: guestId,
                guestId,
                studentName: cleanStudentName,
                dno: cleanDno,
                normalizedDno,
                joinedAt,
                status: "joined",
                guest: true
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({ success: false, message: "This D.no has already joined this workspace." });
            }
            throw error;
        }

        const guestSessionSeconds = workspace.expiresAt
            ? Math.max(60, Math.floor((new Date(workspace.expiresAt).getTime() - Date.now()) / 1000))
            : 60 * 60 * 24 * 365;
        const guestToken = jwt.sign(
            { type: "guest", guestId, workspaceId: cleanWorkspaceId, dno: normalizedDno },
            process.env.JWT_SECRET,
            { expiresIn: guestSessionSeconds, issuer: "testspace" }
        );

        return res.status(201).json({
            success: true,
            message: "Workspace joined successfully.",
            guestToken,
            workspace: {
                workspaceId: workspace.workspaceId,
                workspaceName: workspace.workspaceName,
                examDurationMinutes: workspace.examDurationMinutes || 30,
                expiresAt: workspace.expiresAt
            },
            student: { studentId: guestId, studentName: cleanStudentName, dno: cleanDno }
        });
    } catch (error) {
        console.error("Join Workspace Error:", error);
        return res.status(500).json({ success: false, message: "Unable to join workspace." });
    }
});

// Expiry is enforced synchronously for every workspace-specific API route.
app.use("/api/workspaces/:workspaceId", async (req, res, next) => {
    try {
        if (req.params.workspaceId === "join") return next();
        const workspace = await getActiveWorkspace(req.params.workspaceId);
        if (!workspace) return res.status(404).json({ success: false, message: "Workspace not found or its duration has expired." });
        next();
    } catch (error) {
        console.error("Workspace expiry guard error:", error);
        res.status(500).json({ success: false, message: "Unable to verify workspace availability." });
    }
});

app.use("/api/student/workspaces/:workspaceId", async (req, res, next) => {
    try {
        const workspace = await getActiveWorkspace(req.params.workspaceId);
        if (!workspace) return res.status(404).json({ success: false, message: "Workspace not found or its duration has expired." });
        next();
    } catch (error) {
        console.error("Student workspace expiry guard error:", error);
        res.status(500).json({ success: false, message: "Unable to verify workspace availability." });
    }
});

// ======================================
// GET WORKSPACES API
// ======================================

// ======================================
// OWNER-ONLY WORKSPACE CREDENTIALS
// ======================================

app.get("/api/workspaces/:workspaceId/credentials", authenticateToken, async (req, res) => {
    try {
        const workspace = await db.collection("workspaces").findOne({
            workspaceId: req.params.workspaceId,
            teacherId: String(req.user.userId),
            status: "active"
        }, { projection: { passwordEncrypted: 1 } });
        if (!workspace) return res.status(404).json({ success: false, message: "Workspace not found or access denied." });
        const password = decryptWorkspacePassword(workspace.passwordEncrypted);
        return res.json({ success: true, password, recoverable: Boolean(password) });
    } catch (error) {
        console.error("Workspace Credentials Error:", error);
        return res.status(500).json({ success: false, message: "Unable to load workspace credentials." });
    }
});

app.post("/api/workspaces/:workspaceId/credentials/reset", authenticateToken, async (req, res) => {
    try {
        const workspace = await db.collection("workspaces").findOne({
            workspaceId: req.params.workspaceId,
            teacherId: String(req.user.userId),
            status: "active"
        }, { projection: { workspaceId: 1 } });
        if (!workspace) return res.status(404).json({ success: false, message: "Workspace not found or access denied." });
        // Older workspaces only have a one-way bcrypt hash; the old password
        // cannot be reversed, so an owner can explicitly issue a replacement.
        const password = randomBytes(9).toString("base64url");
        const passwordHash = await bcrypt.hash(password, 12);
        const passwordEncrypted = encryptWorkspacePassword(password);
        await db.collection("workspaces").updateOne(
            { workspaceId: req.params.workspaceId, teacherId: String(req.user.userId) },
            { $set: { passwordHash, passwordEncrypted, passwordUpdatedAt: new Date() } }
        );
        return res.json({ success: true, password, message: "A replacement workspace password was generated." });
    } catch (error) {
        console.error("Workspace Password Reset Error:", error);
        return res.status(500).json({ success: false, message: "Unable to generate a replacement password." });
    }
});

// ======================================
// GET WORKSPACES API (JWT PROTECTED)
// ======================================

app.get("/api/workspaces", authenticateToken, async (req, res) => {
    try {
        await cleanupExpiredWorkspaces();
        // Get teacher identity from verified JWT
        const teacherId = String(req.user.userId);

        const workspaces = await db
            .collection("workspaces")
            .find({
                teacherId: teacherId
            })
            .sort({
                createdAt: -1
            })
            .project({
                passwordHash: 0,
                passwordEncrypted: 0
            })
            .toArray();

        return res.status(200).json({
            success: true,
            count: workspaces.length,
            workspaces
        });

    } catch (error) {
        console.error("Get Workspaces Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch workspaces"
        });
    }
});

// ======================================
// GET STUDENT WORKSPACE API (JWT PROTECTED)
// ======================================

app.get(
    "/api/student/workspaces/:workspaceId",
    authenticateStudentToken,
    async (req, res) => {
        try {
            const { workspaceId } = req.params;

            const studentId = req.student.studentId;
            if (req.student.guest && req.student.workspaceId !== workspaceId) {
                return res.status(403).json({ success: false, message: "This guest session belongs to another workspace." });
            }

            // Verify student membership
            const member = await db.collection("workspaceMembers").findOne({
                workspaceId,
                studentId,
                status: "joined"
            });

            if (!member) {
                return res.status(403).json({
                    success: false,
                    message: "Student has not joined this workspace"
                });
            }

            // Find active workspace
            const workspace = await getActiveWorkspace(workspaceId);

            if (!workspace) {
                return res.status(404).json({
                    success: false,
                    message: "Workspace not found"
                });
            }

            // Fetch workspace questions
            const questionData = await db
                .collection("workspaceQuestions")
                .findOne({ workspaceId });

            return res.status(200).json({
                success: true,
                workspace: {
                    workspaceId: workspace.workspaceId,
                    workspaceName: workspace.workspaceName,
                    description: workspace.description || "",
                    status: workspace.status,
                    questions: questionData?.questions || [],
                    examDurationMinutes: workspace.examDurationMinutes || 30,
                    expiresAt: workspace.expiresAt
                },
                student: {
                    studentId: member.studentId,
                    studentName: member.studentName,
                    dno: member.dno || ""
                }
            });

        } catch (error) {
            console.error("Student Workspace Error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch student workspace"
            });
        }
    }
);

// ======================================
// UPDATE WORKSPACE QUESTIONS API
// JWT PROTECTED + OWNER ONLY
// ======================================

app.put(
    "/api/workspaces/:workspaceId/questions",
    authenticateToken,
    async (req, res) => {
        try {
            const { workspaceId } = req.params;
            const { questions } = req.body;

            // Get authenticated owner ID from JWT
            const teacherId = String(req.user.userId);

            // Validate questions
            if (!Array.isArray(questions)) {
                return res.status(400).json({
                    success: false,
                    message: "Questions must be an array"
                });
            }

            // Find active workspace
            const workspace = await db.collection("workspaces").findOne({
                workspaceId,
                status: "active"
            });

            if (!workspace) {
                return res.status(404).json({
                    success: false,
                    message: "Workspace not found"
                });
            }

            // Verify workspace ownership
            if (String(workspace.teacherId) !== teacherId) {
                return res.status(403).json({
                    success: false,
                    message: "Only the workspace owner can update questions"
                });
            }

            // Save questions
            await db.collection("workspaceQuestions").updateOne(
                { workspaceId },
                {
                    $set: {
                        questions,
                        updatedAt: new Date()
                    }
                },
                { upsert: true }
            );

            return res.status(200).json({
                success: true,
                message: "Questions saved successfully",
                count: questions.length
            });

        } catch (error) {
            console.error("Save Questions Error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to save questions"
            });
        }
    }
);

// ======================================
// GET WORKSPACE QUESTIONS API
// JWT PROTECTED
// OWNER OR JOINED STUDENT ONLY
// ======================================

app.get(
    "/api/workspaces/:workspaceId/questions",
    authenticateToken,
    async (req, res) => {
        try {
            const { workspaceId } = req.params;

            // Get authenticated user ID from JWT
            const userId = String(req.user.userId);

            // Find workspace
            const workspace = await db.collection("workspaces").findOne({
                workspaceId
            });

            if (!workspace) {
                return res.status(404).json({
                    success: false,
                    message: "Workspace not found"
                });
            }

            // Check whether user is the workspace owner
            const isOwner =
                String(workspace.teacherId) === userId;

            // If not owner, verify student membership
            if (!isOwner) {
                const member = await db.collection("workspaceMembers").findOne({
                    workspaceId,
                    studentId: userId,
                    status: "joined"
                });

                if (!member) {
                    return res.status(403).json({
                        success: false,
                        message: "You are not authorized to access these questions"
                    });
                }
            }

            // Fetch questions
            const questionData = await db.collection("workspaceQuestions")
                .findOne({ workspaceId });

            const questions = questionData?.questions || [];

            return res.status(200).json({
                success: true,
                workspaceId,
                questions,
                count: questions.length
            });

        } catch (error) {
            console.error("Get Questions Error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch questions"
            });
        }
    }
);

// ======================================
// SUBMIT EXAM API
// JWT PROTECTED
// ONE ATTEMPT PER STUDENT
// ======================================

app.post(
    "/api/workspaces/:workspaceId/submissions",
    authenticateStudentToken,
    async (req, res) => {
        try {
            const { workspaceId } = req.params;
            const { answers, time } = req.body;

            const studentId = req.student.studentId;
            const email = req.student.email || "";
            if (req.student.guest && req.student.workspaceId !== workspaceId) {
                return res.status(403).json({ success: false, message: "This guest session belongs to another workspace." });
            }

            // Validate answers
            if (
                !answers ||
                typeof answers !== "object" ||
                Array.isArray(answers)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Valid answers are required"
                });
            }

            // Verify workspace
            const workspace = await getActiveWorkspace(workspaceId);

            if (!workspace) {
                return res.status(404).json({
                    success: false,
                    message: "Workspace not found"
                });
            }

            // Verify student membership
            const member = await db.collection("workspaceMembers").findOne({
                workspaceId,
                studentId,
                status: "joined"
            });

            if (!member) {
                return res.status(403).json({
                    success: false,
                    message: "Student has not joined this workspace"
                });
            }

            // Check existing submission
            const existingSubmission = await db.collection("examSubmissions")
                .findOne({
                    workspaceId,
                    studentId
                });

            if (existingSubmission) {
                return res.status(409).json({
                    success: false,
                    message: "You have already submitted this exam. Only one attempt is allowed."
                });
            }

            // Get exam questions
            const questionData = await db.collection("workspaceQuestions")
                .findOne({ workspaceId });

            const questions = questionData?.questions || [];

            if (!questions.length) {
                return res.status(400).json({
                    success: false,
                    message: "No exam questions found"
                });
            }

            // Calculate marks on server
            let totalMarks = 0;
            let obtainedMarks = 0;

            for (let i = 0; i < questions.length; i++) {
                const q = questions[i];

                const studentAnswers = Array.isArray(answers[i])
                    ? answers[i]
                    : [];

                const marks = Number(q.marks) || 0;
                totalMarks += marks;

                let correct = false;

                const options = Array.isArray(q.options)
                    ? q.options
                    : [];

                if (q.type === "Fill in the Blanks") {
                    const expectedAnswer =
                        typeof options[0] === "string"
                            ? options[0].trim()
                            : "";

                    correct =
                        Boolean(expectedAnswer) &&
                        String(studentAnswers[0] || "").trim().toLowerCase() ===
                        expectedAnswer.toLowerCase();

                } else {
                    const correctIndexes = Array.isArray(q.correct)
                        ? q.correct
                        : [];

                    const correctAnswers = correctIndexes
                        .map(index => options[index])
                        .filter(answer => typeof answer === "string")
                        .sort();

                    correct =
                        correctAnswers.length > 0 &&
                        [...studentAnswers]
                            .map(String)
                            .sort()
                            .join("|") === correctAnswers.join("|");
                }

                if (correct) {
                    obtainedMarks += marks;
                }
            }

            const score = totalMarks
                ? Math.round((obtainedMarks / totalMarks) * 100)
                : 0;

            // Prepare submission document
            const submission = {
                workspaceId,
                workspaceName: workspace.workspaceName,
                studentId,
                studentName: member.studentName,
                dno: member.dno || "",
                email,
                answers,
                score,
                obtainedMarks,
                totalMarks,
                time: typeof time === "string" ? time : "",
                submittedAt: new Date()
            };

            // Save submission to MongoDB
            const result = await db.collection("examSubmissions")
                .insertOne(submission);

            return res.status(201).json({
                success: true,
                message: "Exam submitted successfully",
                submissionId: result.insertedId,
                score,
                obtainedMarks,
                totalMarks,
                dno: member.dno || ""
            });

        } catch (error) {

            // Unique index prevents duplicate attempts,
            // even if two requests arrive simultaneously.
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: "You have already submitted this exam. Only one attempt is allowed."
                });
            }

            console.error("Exam Submission Error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to save exam submission"
            });
        }
    }
);

// ======================================
// GET EXAM SUBMISSIONS API
// JWT PROTECTED
// WORKSPACE OWNER ONLY
// ======================================

app.get(
    "/api/workspaces/:workspaceId/submissions",
    authenticateToken,
    async (req, res) => {
        try {
            const { workspaceId } = req.params;

            // Get authenticated teacher ID from JWT
            const teacherId = String(req.user.userId);

            // Verify workspace
            const workspace = await db.collection("workspaces").findOne({
                workspaceId
            });

            if (!workspace) {
                return res.status(404).json({
                    success: false,
                    message: "Workspace not found"
                });
            }

            // Verify workspace ownership
            if (String(workspace.teacherId) !== teacherId) {
                return res.status(403).json({
                    success: false,
                    message: "Only the workspace owner can view submissions"
                });
            }

            // Fetch all submitted exams
            const submissions = await db.collection("examSubmissions")
                .find({ workspaceId })
                .sort({ submittedAt: -1 })
                .toArray();

            // Backfill D.no at read time for older submissions when the
            // student's workspace membership now contains the registration number.
            const members = await db.collection("workspaceMembers")
                .find({ workspaceId })
                .project({ studentId: 1, dno: 1 })
                .toArray();
            const dnoByStudentId = new Map(
                members.map(member => [String(member.studentId), member.dno || ""])
            );
            const enrichedSubmissions = submissions.map(submission => ({
                ...submission,
                dno: submission.dno || dnoByStudentId.get(String(submission.studentId)) || ""
            }));

            return res.status(200).json({
                success: true,
                count: enrichedSubmissions.length,
                submissions: enrichedSubmissions
            });

        } catch (error) {
            console.error("Fetch Submissions Error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch exam submissions"
            });
        }
    }
);

// ======================================
// WORKSPACE STATISTICS API
// JWT PROTECTED
// WORKSPACE OWNER OR JOINED STUDENT
// ======================================

app.get(
    "/api/student/workspaces/:workspaceId/statistics",
    authenticateStudentToken,
    async (req, res) => {
        try {
            const { workspaceId } = req.params;
            const userId = req.student.studentId;
            if (req.student.guest && req.student.workspaceId !== workspaceId) {
                return res.status(403).json({ success: false, message: "This guest session belongs to another workspace." });
            }

            const workspace = await getActiveWorkspace(workspaceId);

            if (!workspace) {
                return res.status(404).json({
                    success: false,
                    message: "Workspace not found"
                });
            }

            const isOwner = String(workspace.teacherId) === userId;

            const member = await db.collection("workspaceMembers").findOne({
                workspaceId,
                studentId: userId,
                status: "joined"
            });

            if (!isOwner && !member) {
                return res.status(403).json({
                    success: false,
                    message: "You do not have access to these statistics"
                });
            }

            const questionData = await db.collection("workspaceQuestions")
                .findOne({ workspaceId });

            // Only the workspace aggregate and fields needed by Analytics
            // are returned. Email and internal student IDs are excluded.
            const rawSubmissions = await db.collection("examSubmissions")
                .find({ workspaceId })
                .sort({ submittedAt: 1 })
                .toArray();

            const members = await db.collection("workspaceMembers")
                .find({ workspaceId })
                .project({ studentId: 1, dno: 1 })
                .toArray();
            const dnoByStudentId = new Map(
                members.map(member => [String(member.studentId), member.dno || ""])
            );
            const submissions = rawSubmissions.map(submission => ({
                workspaceName: submission.workspaceName,
                studentName: submission.studentName,
                dno: submission.dno || dnoByStudentId.get(String(submission.studentId)) || "",
                answers: submission.answers || {},
                score: submission.score,
                obtainedMarks: submission.obtainedMarks,
                totalMarks: submission.totalMarks,
                time: submission.time || "",
                submittedAt: submission.submittedAt
            }));

            return res.status(200).json({
                success: true,
                workspace: {
                    workspaceId: workspace.workspaceId,
                    workspaceName: workspace.workspaceName,
                    questions: questionData?.questions || [],
                    submissions
                }
            });

        } catch (error) {
            console.error("Workspace Statistics Error:", error);

            return res.status(500).json({
                success: false,
                message: "Unable to load workspace statistics"
            });
        }
    }
);

// ======================================
// GLOBAL ERROR HANDLER
// ======================================

app.use((err, req, res, next) => {
    console.error("Application Error:", err);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

// ======================================
// START SERVER
// ======================================

async function startServer() {
    try {
        console.log("--------------------------------");
        console.log("       TESTSPACE BACKEND");
        console.log("--------------------------------");

        console.log("Connecting to MongoDB Atlas...");

        await client.connect();

        console.log("MongoDB connection established!");

        db = client.db(DATABASE_NAME);

        await db.command({ ping: 1 });

        console.log("Database ping successful!");

        // Unique workspace ID index

        await db.collection("workspaces").createIndex(
            { workspaceId: 1 },
            { unique: true }
        );

        // Remove the previous global D.no index. D.no is unique only within
        // a workspace, not across the entire TestPapa platform.
        try {
            await db.collection("usedDnos").dropIndex("one_time_global_dno");
        } catch (indexError) {
            if (![27, 26].includes(indexError.code)) throw indexError;
        }
        await db.collection("workspaceMembers").createIndex(
            { workspaceId: 1, normalizedDno: 1 },
            {
                unique: true,
                name: "one_dno_per_workspace",
                partialFilterExpression: { normalizedDno: { $type: "string" } }
            }
        );

        await db.collection("workspaces").createIndex(
            { expiresAt: 1 },
            { name: "workspace_expiry_lookup" }
        );

        await db.collection("workspaceReports").createIndex(
            { workspaceId: 1, ownerId: 1 },
            { unique: true, name: "one_archived_report_per_owner_workspace" }
        );
        await db.collection("workspaceReports").createIndex(
            { ownerId: 1, archivedAt: -1 },
            { name: "owner_archived_reports" }
        );

        // Unique student membership index

        await db.collection("workspaceMembers").createIndex(
            {
                workspaceId: 1,
                studentId: 1
            },
            { unique: true }
        );

        // One student can submit only once per workspace

        await db.collection("examSubmissions").createIndex(
            {
                workspaceId: 1,
                studentId: 1
            },
            {
                unique: true,
                name: "one_submission_per_student_per_workspace"
            }
        );

        // Index for teacher results

        await db.collection("examSubmissions").createIndex(
            {
                workspaceId: 1,
                submittedAt: -1
            },
            {
                name: "workspace_submissions_by_date"
            }
        );

        console.log("Database indexes ready!");

        await cleanupExpiredWorkspaces();
        const expiryCleanupTimer = setInterval(() => {
            cleanupExpiredWorkspaces().catch(error => console.error("Workspace cleanup error:", error));
        }, 30 * 1000);
        if (typeof expiryCleanupTimer.unref === "function") expiryCleanupTimer.unref();

        app.listen(PORT, "0.0.0.0", () => {
            console.log("--------------------------------");
            console.log("TESTSPACE SERVER STARTED");
            console.log("--------------------------------");

            console.log(`Server: http://localhost:${PORT}`);
            console.log(`Health: http://localhost:${PORT}/api/health`);
            console.log(`Database: http://localhost:${PORT}/api/db-status`);
            console.log(`Workspaces: http://localhost:${PORT}/api/workspaces`);

            console.log("--------------------------------");
        });

    } catch (error) {
        console.error("--------------------------------");
        console.error("SERVER STARTUP FAILED");
        console.error("--------------------------------");

        console.error("Error name:", error.name);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);

        if (error.cause) {
            console.error("Error cause:", error.cause);
        }

        console.error("--------------------------------");

        await client.close().catch(() => {});

        process.exit(1);
    }
}

// ======================================
// RUN APPLICATION
// ======================================

startServer();