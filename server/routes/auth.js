const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/mysql");

const router = express.Router();

// ======================================
// SIGNUP API
// ======================================

router.post("/signup", async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (
            typeof fullName !== "string" ||
            !fullName.trim() ||
            typeof email !== "string" ||
            !email.trim() ||
            typeof password !== "string" ||
            password.length < 8
        ) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid name, email and password (minimum 8 characters)"
            });
        }

        if (Buffer.byteLength(password, "utf8") > 72) {
            return res.status(400).json({
                success: false,
                message: "Password must not exceed 72 bytes"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const passwordHash = await bcrypt.hash(password, 12);

        const [result] = await pool.execute(
            `INSERT INTO users (full_name, email, password_hash)
             VALUES (?, ?, ?)`,
            [fullName.trim(), normalizedEmail, passwordHash]
        );

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: {
                userId: result.insertId,
                fullName: fullName.trim(),
                email: normalizedEmail
            }
        });

    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        console.error("Signup Error:", error);

        res.status(500).json({
            success: false,
            message: "Signup failed"
        });
    }
});


// ======================================
// LOGIN API
// ======================================

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            !email.trim() ||
            typeof password !== "string" ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        if (Buffer.byteLength(password, "utf8") > 72) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Find user in MySQL

        const [users] = await pool.execute(
            `SELECT user_id, full_name, email, password_hash
             FROM users
             WHERE email = ?
             LIMIT 1`,
            [normalizedEmail]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        // Verify password

        const passwordMatches = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check JWT secret

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing in .env");

            return res.status(500).json({
                success: false,
                message: "Authentication configuration error"
            });
        }

        // Generate JWT token

        const token = jwt.sign(
            {
                sub: String(user.user_id),
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
                issuer: "testspace"
            }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",

            token,

            user: {
                userId: user.user_id,
                fullName: user.full_name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login Error:", error);

        res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
});

module.exports = router;