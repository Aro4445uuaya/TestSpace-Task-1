import { useEffect, useRef, useState, type ReactNode, type FormEvent } from "react"
const API_BASE_URL = `http://${window.location.hostname}:3000`

type IconName = "grid" | "folder" | "question" | "users" | "chart" | "settings" | "bell" | "search" | "plus" | "arrow" | "chevron" | "more" | "clock" | "calendar" | "check" | "close" | "download" | "eye" | "eyeOff" | "trash" | "copy" | "logout" | "help" | "book" | "code" | "database" | "brain" | "layers" | "shield" | "play" | "menu" | "external" | "trend" | "file" | "filter" | "send" | "spark" | "link"
function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: IconName
  size?: number
  className?: string
}) {
  const paths: Record<IconName, ReactNode> = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    folder: (
      <path d="M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    ),
    question: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 3h.01" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 21v-3a6 6 0 0 1 12 0v3M17 5a3 3 0 0 1 0 6m1 4a5 5 0 0 1 3 5" />
      </>
    ),
    chart: (
      <>
        <path d="M4 3v17h17M9 16v-5m5 5V7m5 9V4" />
      </>
    ),
    settings: (
      <>
        <path d="m9 3-1 3-3 1-2 3 2 2-1 3 2 3 3-1 2 3h3l1-3 3-1 2-3-2-2 1-3-2-3-3 1-2-3Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    chevron: <path d="m9 5 7 7-7 7" />,
    more: (
      <>
        <circle cx="5" cy="12" r=".8" />
        <circle cx="12" cy="12" r=".8" />
        <circle cx="19" cy="12" r=".8" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M7 3v4m10-4v4M3 11h18" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    download: (
      <>
        <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    eyeOff: (
      <>
        <path d="m3 3 18 18M9 5c6-2 13 7 13 7l-3 4M6 6l-4 6s4 7 10 7l3-1" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7" />
      </>
    ),
    copy: (
      <>
        <rect x="8" y="8" width="12" height="13" rx="2" />
        <path d="M15 8V3H3v13h5" />
      </>
    ),
    logout: (
      <>
        <path d="M9 4H3v16h6m6-13 5 5-5 5m-7-5h12" />
      </>
    ),
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 3h.01" />
      </>
    ),
    book: (
      <>
        <path d="M12 5v16M3 4c4-1 6-1 9 1 3-2 5-2 9-1v15c-4-1-6-1-9 2-3-3-5-3-9-2Z" />
      </>
    ),
    code: <path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18" />,
    database: (
      <>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0" />
      </>
    ),
    brain: (
      <>
        <path d="M12 4v16M12 5C8 0 4 4 5 8c-5 2-3 8 0 8-1 5 5 7 7 3 2 4 8 2 7-3 3 0 5-6 0-8 1-4-3-8-7-3M5 8l3 2m-3 6 3-2m11-6-3 2m3 6-3-2" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3 10 5-10 5L2 8Zm-10 9 10 5 10-5M2 16l10 5 10-5" />
      </>
    ),
    shield: (
      <>
        <path d="m12 2 9 4v6c0 6-9 10-9 10S3 18 3 12V6Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    play: <path d="m8 4 13 8-13 8Z" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    external: (
      <>
        <path d="M14 3h7v7m0-7L10 14M9 3H3v18h18v-6" />
      </>
    ),
    trend: <path d="m3 17 6-6 4 3 8-10m-6 0h6v6" />,
    file: (
      <>
        <path d="M14 2H4v20h16V8ZM14 2v6h6M8 12h8m-8 4h8" />
      </>
    ),
    filter: (
      <>
        <path d="M3 6h18M6 12h12m-8 6h4" />
        <circle cx="8" cy="6" r="2" />
        <circle cx="15" cy="12" r="2" />
      </>
    ),
    send: (
      <>
        <path d="m22 2-8 20-3-9-9-3ZM11 13 22 2" />
      </>
    ),
    spark: <path d="m12 3 2 6 6 3-6 2-2 7-2-7-7-2 7-3Z" />,
    link: (
      <>
        <path d="m9 15 6-6M7 13l-2 2a4 4 0 0 0 6 6l3-3m-4-12 3-3a4 4 0 0 1 6 6l-2 2" />
      </>
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
function Logo({ small = false }: { small?: boolean }) {
  return (
    <div className={`logo ${small ? "small" : ""}`}>
      <span className="logo-mark">
        <svg viewBox="0 0 28 28" fill="none">
          <path
            d="M5 7h18M14 7v16M8 13h12"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="m19 20 2 2 4-5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span>
        testspace<span className="logo-dot">.</span>
      </span>
    </div>
  )
}
function Button({
  children,
  onClick,
  variant = "secondary",
  icon,
  className = "",
  type = "button",
  disabled = false,
}: {
  children: ReactNode
  onClick?: () => void
  variant?: string
  icon?: IconName
  className?: string
  type?: "button" | "submit"
  disabled?: boolean
}) {
  return (
    <button
      type={type}
      className={`button ${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <Icon name={icon} size={17} />} {children}
    </button>
  )
}
function Badge({
  children,
  tone = "green",
}: {
  children: ReactNode
  tone?: string
}) {
  return (
    <span className={`badge ${tone}`}>
      <span />
      {children}
    </span>
  )
}
function Avatar({
  name = "Account",
  color = "",
  small = false,
}: {
  name?: string
  color?: string
  small?: boolean
}) {
  return (
    <span className={`avatar ${color} ${small ? "avatar-small" : ""}`}>
      {name
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")}
    </span>
  )
}
function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  )
}
function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string
  children: ReactNode
  onClose: () => void
  wide?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const old = document.activeElement as HTMLElement
    ref.current?.focus()
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "Tab") {
        const elements = ref.current?.querySelectorAll<HTMLElement>(
          'button,input,select,textarea,[tabindex="0"]',
        )
        if (!elements?.length) return
        const first = elements[0],
          last = elements[elements.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener("keydown", handle)
    return () => {
      document.removeEventListener("keydown", handle)
      old?.focus()
    }
  }, [onClose])
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`modal ${wide ? "wide" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-heading">
          <h2>{title}</h2>
          <button
            className="icon-button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

type Question = {
  id: string
  text: string
  type: string
  options: string[]
  correct: number[]
  marks: number
  difficulty: string
  required: boolean
  shuffle: boolean
}
type Student = {
  name: string
  dno: string
  score: number
  time: string
  obtainedMarks?: number
  totalMarks?: number
  submittedAt?: string
  answers?: Record<number, string[]>
}
type Workspace = {
  id: string
  studentId?: string
  name: string
  password: string
  description: string
  status: string
  icon: IconName
  color: string
  date: string
  questions: Question[]
  students: Student[]
  duration: number
  workspaceDuration?: number
  expiresAt?: string
  pass: number
}
const seedQuestions: Question[] = [
  {
    id: "q1",
    text: "Which of the following is the correct way to create a list in Python?",
    type: "Multiple Choice",
    options: [
      "list = (1, 2, 3)",
      "list = [1, 2, 3]",
      "list = {1, 2, 3}",
      "list = <1, 2, 3>",
    ],
    correct: [1],
    marks: 5,
    difficulty: "Easy",
    required: true,
    shuffle: false,
  },
  {
    id: "q2",
    text: "What is the output of print(type(10)) in Python?",
    type: "Multiple Choice",
    options: [
      "<class 'str'>",
      "<class 'float'>",
      "<class 'int'>",
      "<class 'list'>",
    ],
    correct: [2],
    marks: 5,
    difficulty: "Easy",
    required: true,
    shuffle: false,
  },
  {
    id: "q3",
    text: "Python lists are mutable.",
    type: "True / False",
    options: ["True", "False"],
    correct: [0],
    marks: 5,
    difficulty: "Easy",
    required: true,
    shuffle: false,
  },
  {
    id: "q4",
    text: "Which of these are valid Python data types?",
    type: "Multiple Select",
    options: ["Dictionary", "Tuple", "ArrayList", "Set"],
    correct: [0, 1, 3],
    marks: 5,
    difficulty: "Medium",
    required: true,
    shuffle: false,
  },
  {
    id: "q5",
    text: "Which keyword is used to define a function in Python?",
    type: "Multiple Choice",
    options: ["function", "define", "def", "func"],
    correct: [2],
    marks: 5,
    difficulty: "Easy",
    required: true,
    shuffle: false,
  },
]
const names = [
  "Olivia Rhye",
  "Phoenix Baker",
  "Lana Steiner",
  "Demi Wilkinson",
  "Drew Cano",
  "Natali Craig",
  "Orlando Diggs",
  "Andi Lane",
  "Kate Morrison",
  "James Wilson",
  "Sophia Davis",
  "Noah Williams",
]
const seedWorkspaces: Workspace[] = [
  {
    name: "Python Basics Test",
    id: "TP-PY-2024",
    icon: "code",
    color: "blue",
    status: "Active",
    description:
      "Assess core Python concepts, syntax, and problem-solving skills.",
    password: "python123",
    date: "2024-10-01",
    duration: 30,
    workspaceDuration: 1440,
    pass: 60,
    questions: seedQuestions,
    students: names.map((name, i) => ({
      name,
      dno: `D${String(i + 1).padStart(3, "0")}`,
      score: [92, 88, 76, 96, 48, 84, 68, 52, 80, 64, 72, 44][i],
      time: `${18 + (i % 8)}m ${12 + i * 3}s`,
    })),
  },
  {
    name: "Data Structures",
    id: "TP-DS-2024",
    icon: "layers",
    color: "teal",
    status: "Active",
    description: "Evaluate understanding of algorithms and data structures.",
    password: "structures123",
    date: "2024-09-28",
    duration: 45,
    pass: 60,
    questions: [
      {
        ...seedQuestions[0],
        id: "ds1",
        text: "Which data structure follows the Last In, First Out principle?",
        options: ["Queue", "Stack", "Array", "Tree"],
        correct: [1],
      },
      {
        ...seedQuestions[1],
        id: "ds2",
        text: "What is the average search complexity of a balanced binary search tree?",
        options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
        correct: [2],
      },
    ],
    students: names.slice(0, 9).map((name, i) => ({
      name,
      dno: `D${String(i + 1).padStart(3, "0")}`,
      score: 52 + i * 5,
      time: "28m 14s",
    })),
  },
  {
    name: "SQL Assessment",
    id: "TP-SQL-2024",
    icon: "database",
    color: "sky",
    status: "Active",
    description: "Test database querying and relational database fundamentals.",
    password: "sql123",
    date: "2024-09-25",
    duration: 40,
    pass: 60,
    questions: [
      {
        ...seedQuestions[0],
        id: "sql1",
        text: "Which SQL clause filters grouped results?",
        options: ["WHERE", "HAVING", "ORDER BY", "SELECT"],
        correct: [1],
      },
    ],
    students: names.slice(2, 12).map((name, i) => ({
      name,
      dno: `D${String(i + 1).padStart(3, "0")}`,
      score: 45 + i * 6,
      time: "25m 30s",
    })),
  },
  {
    name: "Aptitude Test",
    id: "TP-APT-2024",
    icon: "brain",
    color: "amber",
    status: "Draft",
    description: "Measure logical reasoning and quantitative aptitude.",
    password: "aptitude123",
    date: "2024-09-22",
    duration: 30,
    pass: 60,
    questions: [
      {
        ...seedQuestions[0],
        id: "apt1",
        text: "What is the next number in the sequence: 2, 4, 8, 16, ...?",
        options: ["20", "24", "32", "64"],
        correct: [2],
      },
    ],
    students: [],
  },
]
function readStored<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}
function stats(ws: Workspace) {
  const scores = ws.students.map((s) => s.score)
  return {
    total: scores.length,
    avg: scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0,
    high: Math.max(0, ...scores),
    low: scores.length ? Math.min(...scores) : 0,
    pass: scores.length
      ? Math.round(
          (scores.filter((s) => s >= ws.pass).length / scores.length) * 100,
        )
      : 0,
  }
}
type StudentResult = {
  student: Student
  serial: number
  name: string
  dno: string
  obtainedMarks: number
  totalMarks: number
  percentage: number
  passed: boolean
  timeTaken: string
}
function formatMarks(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}
function formatTimeTaken(value: string) {
  const match = value.match(/(\d+)\s*m(?:in)?\s*(\d+)\s*s/i)
  if (!match) return value || "00m 00s"
  return `${match[1].padStart(2, "0")}m ${match[2].padStart(2, "0")}s`
}
function studentResults(ws: Workspace): StudentResult[] {
  const workspaceTotal = ws.questions.reduce((sum, q) => sum + q.marks, 0)
  return ws.students.map((student, index) => {
    const totalMarks = student.totalMarks ?? workspaceTotal
    const obtainedMarks =
      student.obtainedMarks ?? (student.score / 100) * totalMarks
    return {
      student,
      serial: index + 1,
      name: student.name || "Unnamed student",
      dno: student.dno?.trim() || "Not provided",
      obtainedMarks,
      totalMarks,
      percentage: student.score,
      passed: student.score >= ws.pass,
      timeTaken: formatTimeTaken(student.time),
    }
  })
}
function isCorrect(q: Question, answers: string[] = []) {
  if (q.type === "Fill in the Blanks") {
    return (
      Boolean(q.options[0]?.trim()) &&
      (answers[0] || "").trim().toLowerCase() ===
        q.options[0].trim().toLowerCase()
    )
  }
  return (
    q.correct.length > 0 &&
    [...answers].sort().join("|") ===
      q.correct
        .map((n) => q.options[n])
        .sort()
        .join("|")
  )
}
function LineChart({
  compact = false,
  values = [42, 51, 47, 64, 57, 76, 70, 82, 78, 90],
  labels = ["1", "2", "3", "4", "5", "6"],
}: {
  compact?: boolean
  values?: number[]
  labels?: string[]
}) {
  const points = values
    .map(
      (v, i) =>
        `${42 + i * (510 / Math.max(1, values.length - 1))},${180 - v * 1.6}`,
    )
    .join(" ")
  return (
    <div className={`line-chart ${compact ? "compact" : ""}`}>
      <svg
        viewBox="0 0 580 210"
        role="img"
        aria-label="Performance trend chart"
      >
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#397bf4" stopOpacity=".2" />
            <stop offset="100%" stopColor="#397bf4" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[20, 60, 100, 140, 180].map((y, i) => (
          <g key={y}>
            <line
              x1="42"
              y1={y}
              x2="555"
              y2={y}
              stroke="currentColor"
              strokeDasharray="3 5"
              opacity=".12"
            />
            <text
              x="10"
              y={y + 4}
              fill="currentColor"
              fontSize="10"
              opacity=".65"
            >
              {100 - i * 25}
            </text>
          </g>
        ))}
        <polygon points={`42,180 ${points} 552,180`} fill="url(#chartFill)" />
        <polyline
          points={points}
          fill="none"
          stroke="#4b8bfa"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {values.map((v, i) => (
          <circle
            key={i}
            cx={42 + i * (510 / Math.max(1, values.length - 1))}
            cy={180 - v * 1.6}
            r="3"
            fill="#4b8bfa"
            stroke="#142032"
            strokeWidth="2"
          />
        ))}
        {labels.map((s, i) => (
          <text
            key={s}
            x={42 + i * (490 / Math.max(1, labels.length - 1))}
            y="204"
            fill="currentColor"
            fontSize="10"
            opacity=".7"
          >
            {s}
          </text>
        ))}
      </svg>
    </div>
  )
}
function Distribution({ ws }: { ws: Workspace }) {
  const counts = [0, 1, 2, 3, 4].map(
    (i) =>
      ws.students.filter(
        (s) =>
          s.score >= i * 20 &&
          (i === 4 ? s.score <= 100 : s.score < (i + 1) * 20),
      ).length,
  )
  const max = Math.max(...counts, 1)
  return (
    <div className="distribution">
      {counts.map((n, i) => (
        <div className="bar-column" key={i}>
          <span>{n}</span>
          <div className="bar-track">
            <div
              className={`bar bar-${i}`}
              style={{ height: `${Math.max(2, (n / max) * 100)}%` }}
            />
          </div>
          <small>
            {i * 20}–{(i + 1) * 20}
          </small>
        </div>
      ))}
    </div>
  )
}
function Donut({ pass }: { pass: number }) {
  return (
    <div className="donut-section">
      <div className="donut">
        <svg
          viewBox="0 0 160 160"
          role="img"
          aria-label={`${pass}% pass, ${100 - pass}% fail`}
        >
          <circle
            cx="80"
            cy="80"
            r="62"
            fill="none"
            stroke="#283448"
            strokeWidth="15"
          />
          <circle
            cx="80"
            cy="80"
            r="62"
            fill="none"
            stroke="#38b6a0"
            strokeWidth="15"
            strokeDasharray={`${pass * 3.896} 389.6`}
            transform="rotate(-90 80 80)"
            strokeLinecap="round"
          />
        </svg>
        <div>
          <strong>{pass}%</strong>
          <span>Pass rate</span>
        </div>
      </div>
      <div className="donut-legend">
        <span>
          <i className="dot teal" />
          Passed <b>{pass}%</b>
        </span>
        <span>
          <i className="dot muted" />
          Failed <b>{100 - pass}%</b>
        </span>
      </div>
    </div>
  )
}
function PageHeading({
  title,
  subtitle,
  children,
  eyebrow,
}: {
  title: string
  subtitle?: string
  children?: ReactNode
  eyebrow?: string
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="heading-actions">{children}</div>
    </div>
  )
}
function Metric({
  label,
  value,
  suffix,
  icon,
  change,
  color = "blue",
}: {
  label: string
  value: string | number
  suffix?: string
  icon: IconName
  change?: string
  color?: string
}) {
  return (
    <div className="metric-card">
      <div className="metric-top">
        <span>{label}</span>
        <span className={`metric-icon ${color}`}>
          <Icon name={icon} size={18} />
        </span>
      </div>
      <div className="metric-value">
        {value}
        <small>{suffix}</small>
      </div>
      <div className="metric-bottom">
        {change ? (
          <>
            <span className="positive">
              <Icon name="trend" size={13} />
              {change}
            </span>
            <span>vs. last month</span>
          </>
        ) : (
          <span>Across this workspace</span>
        )}
      </div>
    </div>
  )
}

export default function App() {
  const [authToken, setAuthToken] = useState(
    () => localStorage.getItem("testspace_token") || ""
  )
  // Restore the current screen on refresh in this browser session.
  // A fresh browser (without this account token) starts at the public landing page.
  const [page, setPage] = useState(() => {
    const token = localStorage.getItem("testspace_token") || ""
    const savedPage = sessionStorage.getItem("testspace_page") || ""
    if (!token) return "landing"
    return savedPage && savedPage !== "login" && savedPage !== "signup"
      ? savedPage
      : "landing"
  })
  const [guestToken, setGuestToken] = useState(() => sessionStorage.getItem("testspace_guest_token") || "")
  const [profileName, setProfileName] = useState(
    () => localStorage.getItem("testspace_profile_name") || "Account"
  )
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [archivedReports, setArchivedReports] = useState<any[]>([])
  const [activeId, setActiveId] = useState(
    () => sessionStorage.getItem("testspace_active_workspace") || ""
  )
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All workspaces")
  const [view, setView] = useState("grid")
  const [performancePeriod, setPerformancePeriod] = useState("Last 30 days")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [menuId, setMenuId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [shareId, setShareId] = useState<string | null>(null)
  const [toast, setToast] = useState("")
  const [studentDetail, setStudentDetail] = useState<Student | null>(null)
  const [joinOpen, setJoinOpen] = useState(false)
  const [joinedWorkspace, setJoinedWorkspace] = useState<Workspace | null>(null)
  const [joinedStudent, setJoinedStudent] = useState<{ name: string; dno: string } | null>(null)
  const ws = workspaces.find((w) => w.id === activeId) || workspaces[0]
useEffect(() => {
  if (!authToken) {
    setWorkspaces([])
    setArchivedReports([])
    return
  }

  const authHeaders = { Authorization: `Bearer ${authToken}` }
  const loadWorkspaces = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/workspaces`,
        { headers: authHeaders }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load workspaces")
      }

      const mappedWorkspaces: Workspace[] = await Promise.all(
        (data.workspaces || []).map(async (item: any) => {
          let savedQuestions: Question[] = []

          try {
            const questionResponse = await fetch(
              `${API_BASE_URL}/api/workspaces/${encodeURIComponent(item.workspaceId)}/questions`,
              { headers: authHeaders }
            )

            const questionData = await questionResponse.json()

            if (questionResponse.ok && questionData.success) {
              savedQuestions = questionData.questions || []
            }
          } catch (error) {
            console.error(
              "Question Loading Error:",
              item.workspaceId,
              error
            )
          }

          let savedPassword = ""
          try {
            const credentialResponse = await fetch(
              `${API_BASE_URL}/api/workspaces/${encodeURIComponent(item.workspaceId)}/credentials`,
              { headers: authHeaders }
            )
            const credentialData = await credentialResponse.json()
            if (credentialResponse.ok && credentialData.success) {
              savedPassword = credentialData.password || ""
            }
          } catch (credentialError) {
            console.error("Workspace Credentials Loading Error:", item.workspaceId, credentialError)
          }

          let savedStudents: Student[] = []

          try {
            const submissionResponse = await fetch(
              `${API_BASE_URL}/api/workspaces/${encodeURIComponent(item.workspaceId)}/submissions`,
              { headers: authHeaders }
            )
            const submissionData = await submissionResponse.json()

            if (submissionResponse.ok && submissionData.success) {
              savedStudents = (submissionData.submissions || []).map((s: any) => ({
                name: s.studentName || joinedStudent?.name || "Unnamed student",
                dno: s.dno || "Not provided",
                score: Number(s.score) || 0,
                time: s.time || "",
                obtainedMarks: Number(s.obtainedMarks) || 0,
                totalMarks: Number(s.totalMarks) || 0,
                answers: s.answers || {},
                submittedAt: s.submittedAt,
              }))
            } else {
              console.error(
                "Submission Loading Error:",
                item.workspaceId,
                submissionData.message || "Unable to load submissions"
              )
            }
          } catch (error) {
            console.error(
              "Submission Loading Error:",
              item.workspaceId,
              error
            )
          }

          return {
            id: item.workspaceId,
            name: item.workspaceName,
            password: savedPassword,
            description: item.description || "",
            status: item.status === "active" ? "Active" : item.status,
            icon: "folder",
            color: "blue",
            date: item.createdAt
              ? new Date(item.createdAt).toISOString().slice(0, 10)
              : "",
            questions: savedQuestions,
            students: savedStudents,
            duration: Number(item.examDurationMinutes || 30),
            workspaceDuration: Number(item.workspaceDurationMinutes || 0),
            expiresAt: item.expiresAt,
            pass: 60,
          }
        })
      )

      setWorkspaces(mappedWorkspaces)

      // Archived reports are stored separately from live workspaces and are
      // returned only to the teacher who originally created each workspace.
      try {
        const reportsResponse = await fetch(`${API_BASE_URL}/api/reports`, { headers: authHeaders })
        const reportsData = await reportsResponse.json()
        setArchivedReports(reportsResponse.ok && reportsData.success ? (reportsData.reports || []) : [])
      } catch (reportError) {
        console.error("Archived Reports Loading Error:", reportError)
        setArchivedReports([])
      }

      if (mappedWorkspaces.length > 0) {
        setActiveId((previousId) =>
          mappedWorkspaces.some((w) => w.id === previousId)
            ? previousId
            : mappedWorkspaces[0].id
        )
      }
    } catch (error) {
      console.error("Dashboard API Error:", error)
    }
  }

  loadWorkspaces()
}, [authToken])


  useEffect(() => {
    if (authToken) {
      sessionStorage.setItem("testspace_page", page)
    } else {
      sessionStorage.removeItem("testspace_page")
      sessionStorage.removeItem("testspace_active_workspace")
    }
  }, [page, authToken])

  useEffect(() => {
    if (activeId) {
      sessionStorage.setItem("testspace_active_workspace", activeId)
    }
  }, [activeId])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(""), 4000)
    return () => clearTimeout(id)
  }, [toast])
  const navigate = (p: string, id?: string) => {
    if (id) setActiveId(id)
    if (p !== "exam-result") setStudentDetail(null)
    sessionStorage.setItem("testspace_page", p)
    setPage(p)
    setSidebarOpen(false)
    setMenuId(null)
    setProfileOpen(false)
    window.scrollTo({ top: 0 })
  }
  const updateWorkspace = (next: Workspace) =>
    setWorkspaces((prev) => prev.map((w) => (w.id === next.id ? next : w)))
  const allStudents = workspaces.reduce((n, w) => n + w.students.length, 0)
  const allQuestions = workspaces.reduce((n, w) => n + w.questions.length, 0)
  const overall = allStudents
    ? Math.round(
        workspaces.reduce(
          (n, w) => n + w.students.reduce((a, s) => a + s.score, 0),
          0,
        ) / allStudents,
      )
    : 0
  const periodDays = performancePeriod === "Last 7 days" ? 7 : 30
  const periodStart = Date.now() - periodDays * 86400000
  const performanceDates = Array.from(
    { length: 6 },
    (_, i) => new Date(periodStart + ((i * periodDays) / 5) * 86400000),
  )
  const performanceValues = performanceDates.map((date) => {
    const students = workspaces
      .flatMap((w) => w.students)
      .filter((s) => {
        const time = new Date(s.submittedAt || Date.now()).getTime()
        return time >= periodStart && time <= date.getTime()
      })
    return students.length
      ? Math.round(students.reduce((a, s) => a + s.score, 0) / students.length)
      : 0
  })
  const workspacePages = [
    "overview",
    "builder",
    "analytics",
    "results",
    "workspace-settings",
  ]
  const isWorkspace = workspacePages.includes(page)
  const filtered = workspaces.filter(
    (w) =>
      `${w.name} ${w.id}`.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === "All workspaces" || w.status === statusFilter),
  )
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setToast("Workspace credentials copied to clipboard")
    } catch {
      setToast("Clipboard unavailable. Select and copy the credentials below.")
    }
  }
  const regenerateWorkspacePassword = async (workspaceId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/workspaces/${encodeURIComponent(workspaceId)}/credentials/reset`,
        { method: "POST", headers: { Authorization: `Bearer ${authToken}` } }
      )
      const data = await response.json()
      if (!response.ok || !data.success || !data.password) {
        throw new Error(data.message || "Unable to generate a replacement password")
      }
      setWorkspaces((current) => current.map((item) =>
        item.id === workspaceId ? { ...item, password: data.password } : item
      ))
      setToast("New workspace password generated. Share the updated password with students.")
    } catch (error) {
      setToast(error instanceof Error ? error.message : "Unable to update workspace password")
    }
  }

  const downloadReport = () => {
    if (ws && !joinedWorkspace) {
      savePDF(ws)
      setToast("Your PDF report has been downloaded")
    }
  }

  const loadStudentStatistics = async () => {
    if (!joinedWorkspace) return

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/student/workspaces/${encodeURIComponent(joinedWorkspace.id)}/statistics`,
        {
          headers: {
            Authorization: `Bearer ${guestToken}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load statistics")
      }

      const students: Student[] = (data.workspace.submissions || []).map((s: any) => ({
        name: s.studentName || "Student",
        dno: s.dno || "Not provided",
        score: Number(s.score) || 0,
        time: s.time || "",
        obtainedMarks: Number(s.obtainedMarks) || 0,
        totalMarks: Number(s.totalMarks) || 0,
        answers: s.answers || {},
        submittedAt: s.submittedAt,
      }))

      setJoinedWorkspace({
        ...joinedWorkspace,
        name: data.workspace.workspaceName || joinedWorkspace.name,
        questions: data.workspace.questions || [],
        students,
      })

      navigate("student-analytics")
    } catch (error) {
      console.error("Student Statistics Error:", error)
      setToast(error instanceof Error ? error.message : "Unable to load statistics")
    }
  }
  return (
    <>
      {page === "login" || page === "signup" ? (
        <AuthPage
  mode={page}
  navigate={navigate}
  onAuthenticated={(token, name) => {
    localStorage.setItem("testspace_token", token)
    localStorage.setItem("testspace_profile_name", name)
    setProfileName(name)
    setAuthToken(token)
    navigate("dashboard")
  }}
/>
      ) : page === "landing" ? (
        <Landing navigate={navigate} join={() => setJoinOpen(true)} />
      ) : page === "exam" && (joinedWorkspace || ws) ? (
        <Exam
          ws={joinedWorkspace || ws!}
          initialName={joinedStudent?.name || ""}
          initialDno={joinedStudent?.dno || ""}
          onStatistics={joinedWorkspace ? loadStudentStatistics : undefined}
          onExit={() => {
            if (joinedWorkspace) {
              sessionStorage.removeItem("testspace_guest_token")
              setGuestToken("")
              setJoinedWorkspace(null)
              setJoinedStudent(null)
              navigate("landing")
            } else navigate("overview")
          }}
         onSubmit={async (student) => {
  const currentWorkspace = joinedWorkspace || ws

  if (!currentWorkspace) return

  // Save submission to MongoDB
  if (joinedWorkspace) {
    const response = await fetch(
      `${API_BASE_URL}/api/workspaces/${encodeURIComponent(currentWorkspace.id)}/submissions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${guestToken}`,
        },
        body: JSON.stringify({
          answers: student.answers,
          time: student.time,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Submission failed")
    }

    student.score = data.score
    student.obtainedMarks = data.obtainedMarks
    student.totalMarks = data.totalMarks
    student.dno = data.dno || joinedStudent?.dno || student.dno
    student.name = joinedStudent?.name || student.name
  }

  if (joinedWorkspace) {
    setJoinedWorkspace({
      ...joinedWorkspace,
      students: [...joinedWorkspace.students, student],
    })
  } else {
    updateWorkspace({
      ...currentWorkspace,
      students: [...currentWorkspace.students, student],
    })
  }

  setStudentDetail(student)
  navigate("exam-result")
}}
        />
      ) : (
        <div className="app-shell">
          {sidebarOpen && (
            <div
              className="sidebar-overlay"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
            <button
              className="logo-button"
              onClick={() => navigate("dashboard")}
              aria-label="TestSpace dashboard"
            >
              <Logo />
            </button>
            <div className="organization">
              <span className="org-icon">
                <Icon name="layers" size={19} />
              </span>
              <div>
                <strong>Acme Academy</strong>
                <span>
                  Pro workspace <i>PRO</i>
                </span>
              </div>
              <Icon name="chevron" size={15} />
            </div>
            <span className="nav-label">WORKSPACE</span>
            <nav className="main-nav">
              {([
                { id: "dashboard", icon: "grid", label: "Dashboard" },
                { id: "workspaces", icon: "folder", label: "Workspaces" },
                {
                  id: "question-bank",
                  icon: "question",
                  label: "Question Bank",
                },
                { id: "students", icon: "users", label: "Students" },
                { id: "reports", icon: "chart", label: "Reports" },
                { id: "settings", icon: "settings", label: "Settings" },
              ] as Array<{
                id: string
                icon: IconName
                label: string
              }>).map((n) => (
                <button
                  key={n.id}
                  className={`nav-item ${
                    page === n.id ||
                    (n.id === "workspaces" && isWorkspace) ||
                    (n.id === "students" && page === "exam-result")
                      ? "active"
                      : ""
                  }`}
                  onClick={() => navigate(n.id)}
                >
                  <Icon name={n.icon} size={19} />
                  <span>{n.label}</span>
                  {n.id === "workspaces" && (
                    <span className="nav-count">{workspaces.length}</span>
                  )}
                </button>
              ))}
            </nav>
            {isWorkspace && ws && (
              <div className="workspace-nav">
                <span className="nav-label">CURRENT WORKSPACE</span>
                <div className="current-workspace">
                  <span className={`workspace-icon mini ${ws.color}`}>
                    <Icon name={ws.icon} size={17} />
                  </span>
                  <span>{ws.name}</span>
                </div>
                {[
                  { id: "overview", text: "Overview" },
                  { id: "builder", text: "Questions" },
                  { id: "results", text: "Student Results" },
                  { id: "analytics", text: "Analytics" },
                  { id: "workspace-settings", text: "Settings" },
                ].map((n) => (
                  <button
                    className={`subnav ${page === n.id ? "active" : ""}`}
                    key={n.id}
                    onClick={() => navigate(n.id)}
                  >
                    {n.text}
                  </button>
                ))}
              </div>
            )}
            <div className="sidebar-bottom">
              <div className="upgrade-card">
                <span className="upgrade-icon">
                  <Icon name="spark" size={19} />
                </span>
                <h3>A little more powerful.</h3>
                <p>More possibilities for your next big assessment.</p>
                <button onClick={() => navigate("landing")}>
                  Explore TestSpace Pro <Icon name="arrow" size={15} />
                </button>
              </div>
              <button
                className="nav-item"
                onClick={() => {
                  navigate("landing")
                  setTimeout(
                    () =>
                      document
                        .getElementById("how-it-works")
                        ?.scrollIntoView({ behavior: "smooth" }),
                    100,
                  )
                }}
              >
                <Icon name="help" size={19} />
                Help & getting started
                <Icon name="external" size={13} />
              </button>
              <div className="sidebar-user">
                <Avatar name={profileName} />
                <div>
                  <strong>{profileName}</strong>
                  <span>Workspace admin</span>
                </div>
                <button
                  className="icon-button"
                  aria-label="Go to public website"
                  onClick={() => navigate("landing")}
                >
                  <Icon name="logout" size={17} />
                </button>
              </div>
            </div>
          </aside>
          <div className="app-main">
            <header className="topbar">
              <div className="topbar-left">
                <button
                  className="icon-button mobile-menu"
                  aria-label="Open navigation"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Icon name="menu" />
                </button>
                <span className="breadcrumb">
                  Workspace <Icon name="chevron" size={13} />
                  <b>
                    {isWorkspace && ws
                      ? ws.name
                      : {
                          dashboard: "Overview",
                          workspaces: "All workspaces",
                          create: "Create workspace",
                          "question-bank": "Question bank",
                          students: "Students",
                          reports: "Reports",
                          settings: "Settings",
                          "exam-result": "Your result",
                          report: "Report preview",
                        }[page] || "Overview"}
                  </b>
                </span>
              </div>
              <div className="topbar-actions">
                <span className="system-status">
                  <i />
                  All systems operational
                </span>
                <span className="topbar-divider" />
                <div className="popover-anchor">
                  <button
                    className={`icon-button notification-button ${
                      notifications ? "selected" : ""
                    }`}
                    aria-label="Notifications"
                    onClick={() => setNotifications(!notifications)}
                  >
                    <Icon name="bell" size={19} />
                    <span className="notification-dot" />
                  </button>
                  {notifications && (
                    <div className="popover notification-popover">
                      <h3>
                        Notifications <Badge tone="blue">2 new</Badge>
                      </h3>
                      <p>
                        <strong>Assessment results are ready</strong>
                        <span>
                          Python Basics Test · 12 submissions evaluated
                        </span>
                      </p>
                      <p>
                        <strong>Welcome to TestSpace</strong>
                        <span>
                          Your workspace is ready. Create your first assessment.
                        </span>
                      </p>
                      <Button
                        onClick={() => {
                          setNotifications(false)
                          navigate("results")
                        }}
                      >
                        View student results
                      </Button>
                    </div>
                  )}
                </div>
                <div className="popover-anchor">
                  <button
                    className="profile-button"
                    onClick={() => setProfileOpen(!profileOpen)}
                    aria-label="Account menu"
                  >
                    <Avatar name={profileName} small />
                    <span>{profileName}</span>
                    <Icon name="chevron" size={13} />
                  </button>
                  {profileOpen && (
                    <div className="popover profile-popover">
                      <button onClick={() => navigate("settings")}>
                        <Icon name="settings" size={17} />
                        Account settings
                      </button>
                      <button onClick={() => navigate("landing")}>
                        <Icon name="external" size={17} />
                        Visit TestSpace website
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </header>
            <main className="main-content">
              {(page === "dashboard" || page === "workspaces") && (
                <>
                  <PageHeading
                    title="My Workspaces"
                    subtitle="A space for every assessment. Everything you need, in one place."
                  >
                    <Button icon="users" onClick={() => setJoinOpen(true)}>
                      Join Workspace
                    </Button>
                    <Button
                      variant="primary"
                      icon="plus"
                      onClick={() => navigate("create")}
                    >
                      Create Workspace
                    </Button>
                  </PageHeading>
                  <div className="metrics-grid">
                    <Metric
                      label="Total workspaces"
                      value={workspaces.length.toString().padStart(2, "0")}
                      icon="folder"
                      change="2 new"
                    />
                    <Metric
                      label="Total students"
                      value={allStudents.toLocaleString()}
                      icon="users"
                      change="12.8%"
                      color="teal"
                    />
                    <Metric
                      label="Questions created"
                      value={allQuestions}
                      icon="question"
                      change="8 new"
                      color="sky"
                    />
                    <Metric
                      label="Average score"
                      value={overall}
                      suffix="%"
                      icon="chart"
                      change="4.2%"
                      color="amber"
                    />
                  </div>
                  <div className="section-heading workspace-section-heading">
                    <div>
                      <h2>
                        Your workspaces{" "}
                        <span className="count-pill">{workspaces.length}</span>
                      </h2>
                      <p>Organize, assess, and track progress.</p>
                    </div>
                    <div className="workspace-controls">
                      <div className="search-input">
                        <Icon name="search" size={17} />
                        <input
                          aria-label="Search workspaces"
                          placeholder="Search workspaces..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                        <kbd>⌘ K</kbd>
                      </div>
                      <select
                        aria-label="Filter workspace status"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option>All workspaces</option>
                        <option>Active</option>
                        <option>Draft</option>
                        <option>Archived</option>
                      </select>
                      <div className="view-toggle">
                        <button
                          aria-label="Grid view"
                          className={view === "grid" ? "active" : ""}
                          onClick={() => setView("grid")}
                        >
                          <Icon name="grid" size={16} />
                        </button>
                        <button
                          aria-label="List view"
                          className={view === "list" ? "active" : ""}
                          onClick={() => setView("list")}
                        >
                          <Icon name="menu" size={17} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`workspaces-grid ${
                      view === "list" ? "list-view" : ""
                    }`}
                  >
                    {filtered.map((w) => (
                      <article className="workspace-card" key={w.id}>
                        <div className="workspace-card-top">
                          <span className={`workspace-icon ${w.color}`}>
                            <Icon name={w.icon} size={23} />
                          </span>
                          <div className="workspace-card-top-right">
                            <Badge
                              tone={
                                w.status === "Active"
                                  ? "green"
                                  : w.status === "Draft"
                                    ? "amber"
                                    : "gray"
                              }
                            >
                              {w.status}
                            </Badge>
                            <div className="popover-anchor">
                              <button
                                aria-label={`Actions for ${w.name}`}
                                className="icon-button more-button"
                                onClick={() =>
                                  setMenuId(menuId === w.id ? null : w.id)
                                }
                              >
                                <Icon name="more" size={19} />
                              </button>
                              {menuId === w.id && (
                                <div className="popover action-menu">
                                  <button
                                    onClick={() => navigate("builder", w.id)}
                                  >
                                    <Icon name="question" size={16} />
                                    Edit questions
                                  </button>
                                  <button
                                    onClick={() => {
                                      setShareId(w.id)
                                      setMenuId(null)
                                    }}
                                  >
                                    <Icon name="send" size={16} />
                                    Share workspace
                                  </button>
                                  <button
                                    onClick={() => {
                                      updateWorkspace({
                                        ...w,
                                        status:
                                          w.status === "Archived"
                                            ? "Active"
                                            : "Archived",
                                      })
                                      setMenuId(null)
                                    }}
                                  >
                                    <Icon name="folder" size={16} />
                                    {w.status === "Archived"
                                      ? "Activate"
                                      : "Archive"}{" "}
                                    workspace
                                  </button>
                                  <button
                                    className="danger-text"
                                    onClick={() => {
                                      setDeleteId(w.id)
                                      setMenuId(null)
                                    }}
                                  >
                                    <Icon name="trash" size={16} />
                                    Delete permanently
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          className="workspace-title"
                          onClick={() => navigate("overview", w.id)}
                        >
                          {w.name}
                        </button>
                        <div className="workspace-id">
                          {w.id}
                          <button
                            aria-label={`Copy ${w.id}`}
                           onClick={() =>
  w.password
    ? copy(`Workspace ID: ${w.id}\nPassword: ${w.password}`)
    : setShareId(w.id)
}
                          >
                            <Icon name="copy" size={12} />
                          </button>
                        </div>
                        <p className="workspace-description">{w.description}</p>
                        <div className="workspace-stats">
                          <div>
                            <Icon name="question" size={15} />
                            <strong>{w.questions.length}</strong>
                            <span>Questions</span>
                          </div>
                          <div>
                            <Icon name="users" size={15} />
                            <strong>{w.students.length}</strong>
                            <span>Students</span>
                          </div>
                          <div>
                            <Icon name="chart" size={15} />
                            <strong>
                              {w.students.length ? `${stats(w).avg}%` : "—"}
                            </strong>
                            <span>Avg. score</span>
                          </div>
                        </div>
                        <div className="workspace-card-footer">
                          <span>
                            <Icon name="calendar" size={13} />
                            Created{" "}
                            {new Date(w.date + "T12:00:00").toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                          <button onClick={() => navigate("overview", w.id)}>
                            Open workspace <Icon name="arrow" size={14} />
                          </button>
                        </div>
                      </article>
                    ))}
                    {!search && statusFilter === "All workspaces" && (
                      <button
                        className="new-workspace-card"
                        onClick={() => navigate("create")}
                      >
                        <span>
                          <Icon name="plus" size={25} />
                        </span>
                        <h3>Your next assessment starts here</h3>
                        <p>
                          Create a dedicated space for your students,
                          <br />
                          questions, and performance insights.
                        </p>
                        <b>
                          Create Workspace <Icon name="arrow" size={15} />
                        </b>
                      </button>
                    )}
                    {filtered.length === 0 && (
                      <div className="empty-state">
                        <Icon name="search" size={32} />
                        <h3>No workspaces found</h3>
                        <p>Try a different search or create a new workspace.</p>
                      </div>
                    )}
                  </div>
                  <div className="dashboard-bottom">
                    <section className="panel performance-panel">
                      <div className="panel-heading">
                        <div>
                          <h2>Performance overview</h2>
                          <p>Average assessment scores over time</p>
                        </div>
                        <select
                          aria-label="Performance period"
                          value={performancePeriod}
                          onChange={(e) => setPerformancePeriod(e.target.value)}
                        >
                          <option>Last 30 days</option>
                          <option>Last 7 days</option>
                        </select>
                      </div>
                      <div className="performance-meta">
                        <strong>
                          {overall}
                          <small>%</small>
                        </strong>
                        <span className="positive">
                          <Icon name="trend" size={14} />
                          4.2%
                        </span>
                        <span>overall average score</span>
                        <div className="chart-legend">
                          <i className="dot blue" />
                          Average score
                        </div>
                      </div>
                      <LineChart
                        values={performanceValues}
                        labels={performanceDates.map((date) =>
                          date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          }),
                        )}
                      />
                    </section>
                    <section className="panel activity-panel">
                      <div className="panel-heading">
                        <h2>Recent activity</h2>
                        <button
                          className="text-button"
                          onClick={() => navigate("reports")}
                        >
                          View all
                          <Icon name="arrow" size={13} />
                        </button>
                      </div>
                      <div className="activity-list">
                        {[
                          {
                            icon: "check",
                            color: "teal",
                            title: "New submissions evaluated",
                            text: "Python Basics Test",
                            time: "12 min ago",
                          },
                          {
                            icon: "folder",
                            color: "blue",
                            title: "Workspace created",
                            text: "Data Structures",
                            time: "1 hour ago",
                          },
                          {
                            icon: "question",
                            color: "sky",
                            title: "New questions added",
                            text: "SQL Assessment",
                            time: "2 hours ago",
                          },
                          {
                            icon: "users",
                            color: "amber",
                            title: "Students joined a workspace",
                            text: "Python Basics Test",
                            time: "3 hours ago",
                          },
                        ].map((a, i) => (
                          <div className="activity-item" key={i}>
                            <span className={`activity-icon ${a.color}`}>
                              <Icon name={a.icon as IconName} size={16} />
                            </span>
                            <div>
                              <strong>{a.title}</strong>
                              <span>{a.text}</span>
                            </div>
                            <small>{a.time}</small>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                  <div className="dashboard-footer">
                    <span>
                      <Icon name="shield" size={14} />
                      Your assessments and data are secure and private.
                    </span>
                    <span>
                      Built for better learning. <b>TestSpace</b>
                    </span>
                  </div>
                </>
              )}
              {page === "create" && (
                <CreateWorkspace
                  existing={workspaces}
                  onCancel={() => navigate("dashboard")}
                  onCreate={async (w) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/workspaces`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
       body: JSON.stringify({
  workspaceName: w.name,
  description: w.description,
  password: w.password,
  examDurationMinutes: w.duration,
  workspaceDurationMinutes: w.workspaceDuration,
}),
      }
    )

    const data = await response.json()

    console.log("CREATE WORKSPACE RESPONSE:", data)

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Workspace creation failed")
    }

    const newWorkspace = {
      ...w,
      id: data.workspace.workspaceId,
      status: "Active",
    }

    setWorkspaces((prev) => [...prev, newWorkspace])

    navigate("overview", newWorkspace.id)

    setToast("Workspace created successfully. Add your first question.")
  } catch (error) {
    console.error("Create Workspace Error:", error)

    setToast(
      error instanceof Error
        ? error.message
        : "Unable to create workspace."
    )
  }
}}
                />
              )}
              {page === "overview" && ws && (
                <WorkspaceOverview
                  ws={ws}
                  navigate={navigate}
                  share={() => setShareId(ws.id)}
                />
              )}
              {page === "builder" && ws && (
  <QuestionBuilder
    key={ws.id}
    ws={ws}
    onSave={async (questions) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/workspaces/${ws.id}/questions`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ questions }),
          }
        )

        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to save questions")
        }

        updateWorkspace({ ...ws, questions })
        setToast("Questions saved to MongoDB successfully!")
      } catch (error) {
        console.error("Question Save Error:", error)
        setToast(
          error instanceof Error
            ? error.message
            : "Unable to save questions"
        )
      }
    }}
    onCancel={() => navigate("overview")}
  />
)}
              {page === "analytics" && ws && !joinedWorkspace && (
                <Analytics
                  ws={ws}
                  workspaces={workspaces}
                  onSelect={setActiveId}
                  onReport={() => navigate("report")}
                />
              )}
              {page === "student-analytics" && joinedWorkspace && (
                <>
                  <div className="page-heading">
                    <div>
                      <h1>Workspace Statistics</h1>
                      <p>Performance summary for {joinedWorkspace.name}.</p>
                    </div>
                    <Button variant="secondary" onClick={() => navigate("exam", joinedWorkspace.id)}>Back to Exam</Button>
                  </div>
                  <Analytics
                    ws={joinedWorkspace}
                    workspaces={[joinedWorkspace]}
                    onSelect={() => {}}
                    onReport={() => {}}
                    allowReport={false}
                  />
                </>
              )}
              {(page === "results" || page === "students") && ws && !joinedWorkspace && (
                <Results
                  ws={ws}
                  workspaces={workspaces}
                  onSelect={setActiveId}
                  onView={setStudentDetail}
                  onExport={downloadReport}
                  onReport={() => navigate("report")}
                />
              )}
              {page === "report" && ws && !joinedWorkspace && (
                <Report
                  ws={ws}
                  onDownload={downloadReport}
                  onBack={() => navigate("results")}
                />
              )}
              {page === "reports" && (
                <>
                  <PageHeading
                    title="Reports & analytics"
                    subtitle="Turn assessment data into meaningful, actionable insights."
                  />
                  <div className="report-workspaces">
                    {workspaces.map((w) => (
                      <div className="panel report-workspace" key={`live-${w.id}`}>
                        <span className={`workspace-icon ${w.color}`}>
                          <Icon name={w.icon} />
                        </span>
                        <div>
                          <h3>{w.name}</h3>
                          <p>
                            {w.students.length} participants · {w.questions.length} questions · {stats(w).avg}% average score · Active workspace
                          </p>
                        </div>
                        <Button icon="chart" onClick={() => navigate("analytics", w.id)}>Analytics</Button>
                        <Button icon="file" onClick={() => navigate("report", w.id)}>View Report</Button>
                      </div>
                    ))}
                    {archivedReports.map((report: any) => {
                      const archivedWorkspace: Workspace = {
                        id: report.workspaceId,
                        name: report.workspaceName || "Archived workspace",
                        password: "",
                        description: report.description || "",
                        status: "Expired",
                        icon: "folder",
                        color: "blue",
                        date: report.createdAt ? new Date(report.createdAt).toISOString().slice(0, 10) : "",
                        questions: (report.questions || []).map((q: any) => ({ ...q, id: String(q.id || q._id || "") })),
                        students: (report.submissions || []).map((submission: any) => ({
                          name: submission.studentName || "Student",
                          dno: submission.dno || "Not provided",
                          score: Number(submission.score) || 0,
                          time: submission.time || "",
                          obtainedMarks: Number(submission.obtainedMarks) || 0,
                          totalMarks: Number(submission.totalMarks) || 0,
                          answers: submission.answers || {},
                          submittedAt: submission.submittedAt,
                        })),
                        duration: Number(report.examDurationMinutes || 30),
                        pass: 60,
                      }
                      return (
                        <div className="panel report-workspace" key={`archived-${report.workspaceId}`}>
                          <span className="workspace-icon blue"><Icon name="file" /></span>
                          <div>
                            <h3>{report.workspaceName}</h3>
                            <p>{archivedWorkspace.students.length} participants · {archivedWorkspace.questions.length} questions · Expired {report.expiredAt ? new Date(report.expiredAt).toLocaleString() : ""}</p>
                          </div>
                          <Button icon="chart" onClick={() => {
                            setWorkspaces((current) => [...current.filter((item) => item.id !== archivedWorkspace.id), archivedWorkspace])
                            setActiveId(archivedWorkspace.id)
                            navigate("analytics", archivedWorkspace.id)
                          }}>Workspace Statistics</Button>
                          <Button icon="file" onClick={() => {
                            setWorkspaces((current) => [...current.filter((item) => item.id !== archivedWorkspace.id), archivedWorkspace])
                            setActiveId(archivedWorkspace.id)
                            navigate("report", archivedWorkspace.id)
                          }}>View Report</Button>
                          <Button variant="primary" icon="download" onClick={() => savePDF(archivedWorkspace)}>Download PDF</Button>
                        </div>
                      )
                    })}
                    {workspaces.length === 0 && archivedReports.length === 0 && (
                      <div className="empty-state">No reports available yet. Reports for expired workspaces will appear here.</div>
                    )}
                  </div>
                </>
              )}
              {page === "question-bank" && (
                <>
                  <PageHeading
                    title="Question Bank"
                    subtitle="Your assessment content, organized across every workspace."
                  >
                    <Button
                      variant="primary"
                      icon="plus"
                      onClick={() =>
                        ws ? navigate("builder") : navigate("create")
                      }
                    >
                      Create Question
                    </Button>
                  </PageHeading>
                  <div className="panel question-bank">
                    {workspaces.flatMap((w) =>
                      w.questions.map((q, i) => (
                        <div className="bank-question" key={`${w.id}-${q.id}`}>
                          <span className="question-number">{i + 1}</span>
                          <div>
                            <h3>{q.text}</h3>
                            <p>
                              {w.name} <span>·</span> {q.type} <span>·</span>{" "}
                              {q.marks} marks
                            </p>
                          </div>
                          <Badge
                            tone={q.difficulty === "Easy" ? "green" : "amber"}
                          >
                            {q.difficulty}
                          </Badge>
                          <button
                            className="icon-button"
                            aria-label="Edit question"
                            onClick={() => navigate("builder", w.id)}
                          >
                            <Icon name="arrow" size={18} />
                          </button>
                        </div>
                      )),
                    )}
                    {!allQuestions && (
                      <div className="empty-state">
                        No questions yet. Create a workspace to get started.
                      </div>
                    )}
                  </div>
                </>
              )}
              {(page === "settings" || page === "workspace-settings") && (
                <Settings
                  ws={page === "workspace-settings" ? ws : undefined}
                  onSave={async (w) => {
                    if (w) {
                      try {
                        const response = await fetch(
                          `${API_BASE_URL}/api/workspaces/${encodeURIComponent(w.id)}/settings`,
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${authToken}`,
                            },
                            body: JSON.stringify({ expiresAt: w.expiresAt }),
                          },
                        )
                        const data = await response.json()
                        if (!response.ok || !data.success) {
                          throw new Error(data.message || "Unable to update workspace expiry")
                        }
                        updateWorkspace({ ...w, expiresAt: data.workspace.expiresAt })
                        setToast("Workspace expiry updated successfully")
                      } catch (error) {
                        setToast(error instanceof Error ? error.message : "Unable to update workspace expiry")
                      }
                    } else {
                      setToast("Settings saved successfully")
                    }
                  }}
                  onDelete={() => ws && setDeleteId(ws.id)}
                />
              )}
              {page === "exam-result" && studentDetail && (joinedWorkspace || ws) && (
                <StudentResult
                  student={studentDetail}
                  ws={joinedWorkspace || ws!}
                  onReport={() => navigate("report")}
                  onStatistics={loadStudentStatistics}
                  showReport={!joinedWorkspace}
                  onBack={() => {
                    if (joinedWorkspace) {
                      setJoinedWorkspace(null)
                      setJoinedStudent(null)
                      setGuestToken("")
                      sessionStorage.removeItem("testspace_guest_token")
                      sessionStorage.removeItem("testspace_active_workspace")
                      navigate("landing")
                    } else {
                      navigate("dashboard")
                    }
                  }}
                />
              )}
            </main>
          </div>
        </div>
      )}
      {deleteId && (
        <Modal
          title="Permanently delete workspace?"
          onClose={() => setDeleteId(null)}
        >
          <div className="warning-icon">
            <Icon name="trash" size={25} />
          </div>
          <p className="modal-copy">
            This action permanently deletes the workspace, exams, questions,
            student submissions, and analytics data.
          </p>
          <div className="danger-notice">
            This cannot be undone.{" "}
            <strong>{workspaces.find((w) => w.id === deleteId)?.name}</strong>{" "}
            and all associated data will be lost.
          </div>
          <div className="modal-actions">
            <Button onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button
              variant="danger"
              icon="trash"
              onClick={() => {
                setWorkspaces(workspaces.filter((w) => w.id !== deleteId))
                setDeleteId(null)
                navigate("dashboard")
                setToast(
                  "Workspace and all associated data permanently deleted",
                )
              }}
            >
              Permanently Delete
            </Button>
          </div>
        </Modal>
      )}
      {shareId &&
        (() => {
          const shared = workspaces.find((w) => w.id === shareId)
          return (
            shared && (
              <Modal
                title="Share your workspace"
                onClose={() => setShareId(null)}
              >
                <p className="modal-copy">
                  Give students these credentials to join{" "}
                  <strong>{shared.name}</strong>. Keep the password private.
                </p>
                <div className="share-credentials">
                  <Field label="Workspace ID">
                    <code>{shared.id}</code>
                  </Field>
                  <Field label="Workspace Password">
                    {shared.password ? (
                      <code>{shared.password}</code>
                    ) : (
                      <div className="credential-recovery">
                        <span>This workspace was created before password recovery was enabled. Its old password cannot be retrieved from a one-way hash.</span>
                        <Button variant="secondary" onClick={() => regenerateWorkspacePassword(shared.id)}>
                          Generate replacement password
                        </Button>
                        <small>Students will need the new password to join this workspace.</small>
                      </div>
                    )}
                  </Field>
                </div>
                <div className="info-notice">
                  <Icon name="shield" size={18} />
                  Students can access this workspace's exam and workspace-wide
                  statistics. PDF reports remain available to the owner only.
                </div>
                <div className="modal-actions">
                  <Button
                    icon="play"
                    onClick={() => {
                      setShareId(null)
                      navigate("exam", shared.id)
                    }}
                  >
                    Preview Exam
                  </Button>
                  <Button
                    icon="copy"
                    variant="primary"
                    onClick={() =>
                      copy(
                        `Workspace ID: ${shared.id}\nPassword: ${shared.password}`,
                      )
                    }
                  >
                    Copy Credentials
                  </Button>
                </div>
              </Modal>
            )
          )
        })()}
      {studentDetail && page !== "exam-result" && (
        <Modal
          title="Student result"
          wide
          onClose={() => setStudentDetail(null)}
        >
          {ws && (
            <StudentResult
              student={studentDetail}
              ws={ws}
              onReport={() => {
                setStudentDetail(null)
                navigate("report")
              }}
            />
          )}
        </Modal>
      )}
      {joinOpen && (
        <JoinWorkspace
          workspaces={workspaces}
          onClose={() => setJoinOpen(false)}
          onJoin={(workspace, student, token) => {
  sessionStorage.setItem("testspace_guest_token", token)
  setGuestToken(token)
  setJoinOpen(false)
  setJoinedWorkspace(workspace)
  setJoinedStudent(student)
  setActiveId(workspace.id)
  navigate("exam", workspace.id)
}}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          <span>
            <Icon name="check" size={17} />
          </span>
          {toast}
          <button
            className="icon-button"
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
    </>
  )
}

function CreateWorkspace({
  existing,
  onCancel,
  onCreate,
}: {
  existing: Workspace[]
  onCancel: () => void
  onCreate: (w: Workspace) => void
}) {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "",
    id: "",
    password: "",
    description: "",
    duration: 30,
    workspaceDuration: 1440,
    pass: 60,
    shuffle: true,
  })
  const change = (key: string, value: string | number | boolean) => {
    setForm({ ...form, [key]: value })
    setError("")
  }
  function next() {
    if (step === 1) {
      if (!form.name.trim() || form.password.length < 6) {
        setError(
          "Enter a workspace name and a password with at least 6 characters.",
        )
        return
      }
    }
    if (
      step === 2 &&
      (form.duration < 1 ||
        form.duration > 600 ||
        form.workspaceDuration < 1 ||
        form.workspaceDuration > 525600 ||
        form.pass < 1 ||
        form.pass > 100)
    ) {
      setError(
        "Exam duration must be 1–600 minutes, workspace duration must be between 1 minute and 8760 hours, and pass percentage 1–100.",
      )
      return
    }
    if (step < 3) setStep(step + 1)
    else
      onCreate({
        ...form,
        name: form.name.trim(),
        id: "",
        status: "Draft",
        icon: "folder",
        color: "blue",
        date: new Date().toISOString().slice(0, 10),
        questions: [],
        students: [],
      })
  }
  return (
    <>
      <PageHeading
        title="Create New Workspace"
        subtitle="Build a dedicated environment for your next assessment."
      />
      <div className="creation-layout">
        <section className="panel creation-panel">
          <div className="stepper">
            {["Details", "Settings", "Confirm"].map((s, i) => (
              <div
                className={`${step === i + 1 ? "current" : ""} ${
                  step > i + 1 ? "completed" : ""
                }`}
                key={s}
              >
                <span>
                  {step > i + 1 ? <Icon name="check" size={16} /> : i + 1}
                </span>
                {s}
              </div>
            ))}
          </div>
          <div className="creation-fields">
            <h2>
              {
                ["Workspace details", "Exam settings", "Ready to create?"][
                  step - 1
                ]
              }
            </h2>
            <p>
              {
                [
                  "A great assessment starts with a clear, organized workspace.",
                  "Set the ground rules for a fair assessment.",
                  "Review your details. You can add questions after creating your workspace.",
                ][step - 1]
              }
            </p>
            {step === 1 && (
              <>
                <Field label="Workspace Name *">
                  <input
                    placeholder="e.g. Python Basics Test"
                    value={form.name}
                    onChange={(e) => change("name", e.target.value)}
                  />
                </Field>
                <Field
                  label="Workspace ID"
                  hint="A unique, easy-to-enter 6-digit ID is generated automatically when you create the workspace."
                >
                  <input value="Generated automatically (TS-######)" readOnly />
                </Field>
                <Field
                  label="Workspace Password *"
                  hint="Use at least 6 characters. Share this only with your students."
                >
                  <div className="password-input">
                    <input
                      placeholder="Create a secure password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => change("password", e.target.value)}
                    />
                    <button
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="icon-button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <Icon name={showPassword ? "eyeOff" : "eye"} size={18} />
                    </button>
                  </div>
                </Field>
                <Field
                  label="Description"
                  hint="Optional. Help students understand what this assessment covers."
                >
                  <textarea
                    rows={3}
                    placeholder="Describe the purpose of this workspace..."
                    value={form.description}
                    onChange={(e) => change("description", e.target.value)}
                  />
                </Field>
              </>
            )}
            {step === 2 && (
              <>
                <Field label="Time limit (minutes)">
                  <input
                    type="number"
                    min={1}
                    max={240}
                    value={form.duration}
                    onChange={(e) => change("duration", +e.target.value)}
                  />
                </Field>
                <Field
                  label="Workspace duration"
                  hint="Choose how long this workspace stays active. When the duration expires, all workspace records—including student submissions and session analytics—will be automatically deleted. Increase the duration if you need more time to retain these records. Your archived PDF report will remain available to you in Reports."
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={{ display: "block", marginBottom: 6, fontSize: 13 }}>Hours</label>
                      <input
                        type="number"
                        min={0}
                        max={8760}
                        value={Math.floor(form.workspaceDuration / 60)}
                        onChange={(e) => {
                          const hours = Math.max(0, Math.min(8760, Number(e.target.value) || 0))
                          const minutes = form.workspaceDuration % 60
                          change("workspaceDuration", hours * 60 + minutes)
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: 6, fontSize: 13 }}>Minutes</label>
                      <input
                        type="number"
                        min={0}
                        max={59}
                        value={form.workspaceDuration % 60}
                        onChange={(e) => {
                          const minutes = Math.max(0, Math.min(59, Number(e.target.value) || 0))
                          const hours = Math.floor(form.workspaceDuration / 60)
                          change("workspaceDuration", hours * 60 + minutes)
                        }}
                      />
                    </div>
                  </div>
                  <div className="workspace-expiry-warning" role="note">
                    <strong>Workspace expiry</strong>
                    <span>When this duration ends, all workspace records, including student submissions and session analytics, will be automatically deleted. Increase the duration if you need more time. Your archived PDF report remains available to the workspace owner.</span>
                  </div>
                </Field>
                <Field label="Passing percentage">
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={form.pass}
                    onChange={(e) => change("pass", +e.target.value)}
                  />
                </Field>
                <div className="info-notice">
                  <Icon name="shield" size={20} />
                  Automatic evaluation is enabled for objective questions.
                  Written answers require manual review.
                </div>
              </>
            )}
            {step === 3 && (
              <div className="confirm-details">
                {[
                  ["Workspace name", form.name],
                  ["Workspace ID", "Generated automatically after creation"],
                  ["Description", form.description || "No description"],
                  ["Exam duration", `${form.duration} minutes`],
                  ["Workspace duration", `${Math.floor(form.workspaceDuration / 60)} hours ${form.workspaceDuration % 60} minutes`],
                  ["Passing percentage", `${form.pass}%`],
                ].map(([k, v]) => (
                  <div key={k}>
                    <span>{k}</span>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
          </div>
          <div className="form-footer">
            <Button onClick={step === 1 ? onCancel : () => setStep(step - 1)}>
              {step === 1 ? "Cancel" : "Back"}
            </Button>
            <Button variant="primary" onClick={next}>
              {step === 3 ? "Create Workspace" : "Next"}
              <Icon name={step === 3 ? "check" : "arrow"} size={16} />
            </Button>
          </div>
        </section>
        <aside className="creation-aside">
          <span className="workspace-icon blue">
            <Icon name="shield" size={26} />
          </span>
          <h3>One workspace. Everything in place.</h3>
          <p>
            Questions, student submissions, results, and analytics stay
            organized in their own secure environment.
          </p>
          {[
            "Private workspace credentials",
            "Automatic question evaluation",
            "Isolated performance analytics",
            "Downloadable PDF reports",
          ].map((s) => (
            <div className="feature-check" key={s}>
              <Icon name="check" size={16} />
              {s}
            </div>
          ))}
        </aside>
      </div>
    </>
  )
}
function WorkspaceOverview({
  ws,
  navigate,
  share,
}: {
  ws: Workspace
  navigate: (p: string, id?: string) => void
  share: () => void
}) {
  const s = stats(ws)
  return (
    <>
      <PageHeading title={ws.name} subtitle={ws.description}>
        <Button icon="send" onClick={share}>
          Share Workspace
        </Button>
        <Button
          variant="primary"
          icon="plus"
          onClick={() => navigate("builder")}
        >
          Create Question
        </Button>
      </PageHeading>
      <div className="workspace-summary panel">
        <span className={`workspace-icon ${ws.color}`}>
          <Icon name={ws.icon} size={28} />
        </span>
        <div>
          <h3>{ws.id}</h3>
          <p>
            Created {ws.date} · {ws.duration} minute exam · {ws.pass}% to pass
          </p>
        </div>
        <Badge tone={ws.status === "Active" ? "green" : "amber"}>
          {ws.status}
        </Badge>
        <Button icon="play" onClick={() => navigate("exam")}>
          Preview Exam
        </Button>
      </div>
      <div className="metrics-grid">
        <Metric label="Questions" value={ws.questions.length} icon="question" />
        <Metric
          label="Total students"
          value={s.total}
          icon="users"
          color="teal"
        />
        <Metric label="Average score" value={s.avg} suffix="%" icon="chart" />
        <Metric
          label="Pass rate"
          value={s.pass}
          suffix="%"
          icon="check"
          color="teal"
        />
      </div>
      <div className="overview-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Your assessment</h2>
              <p>
                {ws.questions.length} questions ·{" "}
                {ws.questions.reduce((a, q) => a + q.marks, 0)} total marks
              </p>
            </div>
            <Button onClick={() => navigate("builder")} icon="plus">
              Add Question
            </Button>
          </div>
          {ws.questions.map((q, i) => (
            <div className="overview-question" key={q.id}>
              <span className="question-number">{i + 1}</span>
              <div>
                <h3>{q.text}</h3>
                <p>
                  {q.type} · {q.marks} marks
                </p>
              </div>
              <Badge tone="blue">{q.difficulty}</Badge>
            </div>
          ))}
          {!ws.questions.length && (
            <div className="empty-state">
              <Icon name="question" size={32} />
              <h3>Let's build your assessment</h3>
              <p>
                Add questions, configure correct answers, and get ready to
                share.
              </p>
              <Button variant="primary" onClick={() => navigate("builder")}>
                Create your first question
              </Button>
            </div>
          )}
        </section>
        <section className="panel quick-actions">
          <h2>Workspace tools</h2>
          {[
            {
              name: "Performance analytics",
              text: "See the bigger picture",
              icon: "chart",
              page: "analytics",
            },
            {
              name: "Student results",
              text: "Every submission, in detail",
              icon: "users",
              page: "results",
            },
            {
              name: "Downloadable report",
              text: "Share insights with your team",
              icon: "file",
              page: "report",
            },
            {
              name: "Workspace settings",
              text: "Manage access and exam rules",
              icon: "settings",
              page: "workspace-settings",
            },
          ].map((a) => (
            <button key={a.page} onClick={() => navigate(a.page)}>
              <span className="metric-icon blue">
                <Icon name={a.icon as IconName} />
              </span>
              <div>
                <strong>{a.name}</strong>
                <span>{a.text}</span>
              </div>
              <Icon name="chevron" size={16} />
            </button>
          ))}
        </section>
      </div>
    </>
  )
}

function QuestionBuilder({
  ws,
  onSave,
  onCancel,
}: {
  ws: Workspace
 onSave: (questions: Question[]) => Promise<void>
  onCancel: () => void
}) {
  const blank = (): Question => ({
    id: globalThis.crypto?.randomUUID?.() ??
  `q-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    text: "",
    type: "Multiple Choice",
    options: ["", "", "", ""],
    correct: [],
    marks: 5,
    difficulty: "Medium",
    required: true,
    shuffle: false,
  })
  const [q, setQ] = useState<Question>(blank)
  const [error, setError] = useState("")
  const [selected, setSelected] = useState<string | null>(null)
  const editor = useRef<HTMLDivElement>(null)
  const update = (key: keyof Question, value: unknown) => {
    setQ((prev) => ({ ...prev, [key]: value }))
    setError("")
  }
  const objective = [
    "Multiple Choice",
    "Multiple Select",
    "True / False",
  ].includes(q.type)
  const load = (question: Question) => {
    setQ({ ...question })
    setSelected(question.id)
    if (editor.current) editor.current.textContent = question.text
  }
 const save = async () => {
  if (!q.text.trim()) {
    setError("Please enter a question.")
    return
  }

  if (q.marks < 1) {
    setError("Marks must be at least 1.")
    return
  }

  if (
    objective &&
    (q.options.some((s) => !s.trim()) || !q.correct.length)
  ) {
    setError("Fill in all answer options and select the correct answer.")
    return
  }

  if (q.type === "Fill in the Blanks" && !q.options[0]?.trim()) {
    setError("Enter the correct answer.")
    return
  }

  try {
    await onSave(
      selected
        ? ws.questions.map((item) =>
            item.id === selected ? q : item
          )
        : [...ws.questions, q]
    )

    setQ(blank())
    setSelected(null)

    if (editor.current) {
      editor.current.textContent = ""
    }
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Unable to save question."
    )
  }
}
  return (
    <>
      <PageHeading
        title={selected ? "Edit Question" : "Create Question"}
        subtitle={`Build a thoughtful assessment for ${ws.name}.`}
      >
        <Badge tone="blue">{ws.questions.length} questions in workspace</Badge>
      </PageHeading>
      <div className="builder-layout">
        <section className="panel editor-panel">
          <div className="panel-heading">
            <div>
              <h2>Question content</h2>
              <p>Make every question clear and purposeful.</p>
            </div>
            <span className="muted-text">
              {selected ? "Editing" : "New question"}
            </span>
          </div>
          <div className="editor-body">
            <Field label="Question Type">
              <select
                value={q.type}
                onChange={(e) => {
                  const type = e.target.value
                  setQ({
                    ...q,
                    type,
                    correct: [],
                    options:
                      type === "True / False"
                        ? ["True", "False"]
                        : type === "Fill in the Blanks"
                          ? [""]
                          : ["", "", "", ""],
                  })
                }}
              >
                {[
                  "Multiple Choice",
                  "Multiple Select",
                  "Subjective",
                  "True / False",
                  "Fill in the Blanks",
                  "Paragraph",
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <label className="field">
              <span>
                Question text <b className="required">*</b>
              </span>
              <div className="rich-editor">
                <div className="editor-toolbar">
                  {[
                    { label: "Bold", command: "bold", text: "B" },
                    { label: "Italic", command: "italic", text: "I" },
                    { label: "Underline", command: "underline", text: "U" },
                    {
                      label: "Bulleted list",
                      command: "insertUnorderedList",
                      text: "≡",
                    },
                  ].map((t) => (
                    <button
                      key={t.command}
                      type="button"
                      aria-label={t.label}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        editor.current?.focus()
                        document.execCommand(t.command)
                      }}
                    >
                      {t.text}
                    </button>
                  ))}
                  <span />
                  <button
                    aria-label="Clear formatting"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => document.execCommand("removeFormat")}
                  >
                    Tx
                  </button>
                  <small>Rich text supported</small>
                </div>
                <div
                  className="editable"
                  contentEditable
                  role="textbox"
                  aria-label="Question text"
                  aria-multiline="true"
                  ref={editor}
                  data-placeholder="Type your question here..."
                  onInput={(e) => update("text", e.currentTarget.innerText)}
                  suppressContentEditableWarning
                />
              </div>
            </label>
            {objective && (
              <div className="answer-editor">
                <div className="answer-editor-label">
                  <h3>Answer options</h3>
                  <span>
                    Select the{" "}
                    {q.type === "Multiple Select"
                      ? "correct answers"
                      : "correct answer"}
                  </span>
                </div>
                {q.options.map((opt, i) => (
                  <div
                    className={`option-input ${
                      q.correct.includes(i) ? "correct" : ""
                    }`}
                    key={i}
                  >
                    <input
                      type={q.type === "Multiple Select" ? "checkbox" : "radio"}
                      aria-label={`Option ${String.fromCharCode(65 + i)} is correct`}
                      checked={q.correct.includes(i)}
                      onChange={() =>
                        update(
                          "correct",
                          q.type === "Multiple Select"
                            ? q.correct.includes(i)
                              ? q.correct.filter((n) => n !== i)
                              : [...q.correct, i]
                            : [i],
                        )
                      }
                    />
                    <span>{String.fromCharCode(65 + i)}</span>
                    <input
                      placeholder={`Answer option ${i + 1}`}
                      aria-label={`Answer option ${i + 1}`}
                      value={opt}
                      readOnly={q.type === "True / False"}
                      onChange={(e) =>
                        update(
                          "options",
                          q.options.map((v, j) =>
                            j === i ? e.target.value : v,
                          ),
                        )
                      }
                    />
                    {q.correct.includes(i) && (
                      <span className="correct-label">
                        <Icon name="check" size={13} />
                        Correct
                      </span>
                    )}
                    {q.options.length > 2 && (
                      <button
                        aria-label={`Remove option ${i + 1}`}
                        className="icon-button"
                        onClick={() => {
                          setQ({
                            ...q,
                            options: q.options.filter((_, j) => j !== i),
                            correct: q.correct
                              .filter((n) => n !== i)
                              .map((n) => (n > i ? n - 1 : n)),
                          })
                        }}
                      >
                        <Icon name="close" size={14} />
                      </button>
                    )}
                  </div>
                ))}
                {q.type !== "True / False" && (
                  <button
                    className="text-button add-option"
                    onClick={() => update("options", [...q.options, ""])}
                  >
                    <Icon name="plus" size={16} />
                    Add Option
                  </button>
                )}
              </div>
            )}
            {q.type === "Fill in the Blanks" && (
              <Field
                label="Correct answer"
                hint="Answers are matched case-insensitively."
              >
                <input
                  placeholder="Enter the expected answer"
                  value={q.options[0] || ""}
                  onChange={(e) => update("options", [e.target.value])}
                />
              </Field>
            )}
            {["Subjective", "Paragraph"].includes(q.type) && (
              <div className="info-notice">
                <Icon name="file" />
                Students will enter a written response. This question requires
                manual evaluation.
              </div>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
          </div>
          <div className="form-footer">
            <Button onClick={onCancel}>Cancel</Button>
            <Button variant="primary" icon="check" onClick={save}>
              Save Question
            </Button>
          </div>
        </section>
        <aside className="builder-aside">
          <section className="panel settings-panel">
            <div className="panel-heading">
              <h2>Question settings</h2>
              <Icon name="settings" size={18} />
            </div>
            <Field label="Marks">
              <input
                min={1}
                max={100}
                type="number"
                value={q.marks}
                onChange={(e) => update("marks", +e.target.value)}
              />
            </Field>
            <Field label="Difficulty">
              <select
                value={q.difficulty}
                onChange={(e) => update("difficulty", e.target.value)}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </Field>
            <div className="toggle-row">
              <div>
                <strong>Required</strong>
                <span>Must be answered to submit</span>
              </div>
              <button
                className={`toggle ${q.required ? "on" : ""}`}
                role="switch"
                aria-checked={q.required}
                aria-label="Required question"
                onClick={() => update("required", !q.required)}
              >
                <span />
              </button>
            </div>
            <div className="toggle-row">
              <div>
                <strong>Shuffle Options</strong>
                <span>Randomize answer order</span>
              </div>
              <button
                className={`toggle ${q.shuffle ? "on" : ""}`}
                role="switch"
                aria-checked={q.shuffle}
                aria-label="Shuffle options"
                onClick={() => update("shuffle", !q.shuffle)}
              >
                <span />
              </button>
            </div>
            <div className="info-notice">
              <Icon name="shield" size={18} />
              Correct answers are never visible during the exam.
            </div>
          </section>
          <section className="panel saved-questions">
            <h3>
              Workspace questions{" "}
              <span className="count-pill">{ws.questions.length}</span>
            </h3>
            {ws.questions.map((item, i) => (
              <button
                key={item.id}
                className={selected === item.id ? "selected" : ""}
                onClick={() => load(item)}
              >
                <span>{i + 1}</span>
                <p>{item.text}</p>
                <Icon name="chevron" size={13} />
              </button>
            ))}
          </section>
        </aside>
      </div>
    </>
  )
}

function Analytics({
  ws: sourceWorkspace,
  workspaces,
  onSelect,
  onReport,
  allowReport = true,
}: {
  ws: Workspace
  workspaces: Workspace[]
  onSelect: (id: string) => void
  onReport: () => void
  allowReport?: boolean
}) {
  const [range, setRange] = useState("All time")
  const days = range === "Last 7 days" ? 7 : 30
  const ws =
    range === "All time"
      ? sourceWorkspace
      : {
          ...sourceWorkspace,
          students: sourceWorkspace.students.filter(
            (s) =>
              new Date(s.submittedAt || sourceWorkspace.date).getTime() >=
              Date.now() - days * 86400000,
          ),
        }
  const s = stats(ws)
  return (
    <>
      <PageHeading
        title="Analytics Overview"
        subtitle="Detailed performance insights for your workspace."
      >
        <select
          value={ws.id}
          aria-label="Exam selector"
          onChange={(e) => onSelect(e.target.value)}
        >
          {workspaces.map((w) => (
            <option value={w.id} key={w.id}>
              {w.name}
            </option>
          ))}
        </select>
        <select
          value={range}
          aria-label="Date range"
          onChange={(e) => setRange(e.target.value)}
        >
          <option>All time</option>
          <option>Last 30 days</option>
          <option>Last 7 days</option>
        </select>
        {allowReport && (
          <Button icon="download" onClick={onReport}>
            View Report
          </Button>
        )}
      </PageHeading>
      <div className="scope-notice">
        <Icon name="shield" size={15} />
        Showing isolated analytics for <strong>{ws.name}</strong>
        <span>{ws.id}</span>
      </div>
      <div className="metrics-grid">
        <Metric label="Total students attended" value={s.total} icon="users" />
        <Metric
          label="Average score"
          value={s.avg}
          suffix="%"
          icon="chart"
          color="teal"
        />
        <Metric label="Highest score" value={s.high} suffix="%" icon="trend" />
        <Metric
          label="Lowest score"
          value={s.low}
          suffix="%"
          icon="chart"
          color="amber"
        />
      </div>
      <div className="analytics-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Score distribution</h2>
              <p>Students grouped by score range</p>
            </div>
            <Icon name="chart" size={17} />
          </div>
          <Distribution ws={ws} />
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Pass / fail percentage</h2>
              <p>Passing threshold: {ws.pass}%</p>
            </div>
          </div>
          <Donut pass={s.pass} />
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Question-wise accuracy</h2>
              <p>Understand where students need support</p>
            </div>
          </div>
          <div className="accuracy-chart">
            {ws.questions.map((q, i) => {
              const actual = ws.students.filter((s) => s.answers)
              const percent = actual.length
                ? Math.round(
                    (actual.filter((s) => isCorrect(q, s.answers?.[i])).length /
                      actual.length) *
                      100,
                  )
                : 0
              return (
                <div key={q.id}>
                  <span>Q{i + 1}</span>
                  <div>
                    <i style={{ width: `${percent}%` }} />
                  </div>
                  <b>{actual.length ? `${percent}%` : "—"}</b>
                </div>
              )
            })}
            <small>
              Question-level accuracy is available for submissions made in this
              app.
            </small>
          </div>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Average score by exam</h2>
              <p>Your selected workspace's assessment</p>
            </div>
          </div>
          <div className="exam-average">
            <span className={`workspace-icon ${ws.color}`}>
              <Icon name={ws.icon} />
            </span>
            <div>
              <strong>{ws.name}</strong>
              <span>{s.total} students assessed</span>
            </div>
            <b>{s.avg}%</b>
          </div>
          <div className="average-bar">
            <div style={{ width: `${s.avg}%` }} />
          </div>
          <div className="average-markers">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
          <div className="mini-stats">
            <div>
              <span>Average marks</span>
              <strong>
                {(
                  (s.avg / 100) *
                  ws.questions.reduce((a, q) => a + q.marks, 0)
                ).toFixed(1)}
              </strong>
            </div>
            <div>
              <span>Pass percentage</span>
              <strong className="positive">{s.pass}%</strong>
            </div>
            <div>
              <span>Fail percentage</span>
              <strong>{s.total ? 100 - s.pass : 0}%</strong>
            </div>
          </div>
        </section>
        <section className="panel trend-panel">
          <div className="panel-heading">
            <div>
              <h2>Student performance trend</h2>
              <p>Score progression across submitted assessments</p>
            </div>
            <span className="chart-legend">
              <i className="dot blue" />
              Score %
            </span>
          </div>
          {ws.students.length > 1 ? (
            <LineChart values={ws.students.map((st) => st.score)} />
          ) : (
            <div className="empty-state">
              At least two submissions are needed to display a trend.
            </div>
          )}
        </section>
      </div>
    </>
  )
}
function Results({
  ws,
  workspaces,
  onSelect,
  onView,
  onExport,
  onReport,
}: {
  ws: Workspace
  workspaces: Workspace[]
  onSelect: (id: string) => void
  onView: (s: Student) => void
  onExport: () => void
  onReport: () => void
}) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("All results")
  const s = stats(ws)
  const students = studentResults(ws).filter(
    (result) =>
      `${result.name} ${result.dno}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (filter === "All results" ||
        (filter === "Pass" ? result.passed : !result.passed)),
  )
  return (
    <>
      <PageHeading
        title="Student Results"
        subtitle="Every student's performance, clearly and confidently."
      >
        <select
          aria-label="Workspace selector"
          value={ws.id}
          onChange={(e) => onSelect(e.target.value)}
        >
          {workspaces.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>
        <Button icon="download" onClick={onExport}>
          Export PDF
        </Button>
      </PageHeading>
      <div className="results-summary">
        <div>
          <span>Total participants</span>
          <strong>{s.total}</strong>
        </div>
        <div>
          <span>Average score</span>
          <strong>{s.avg}%</strong>
        </div>
        <div>
          <span>Passed</span>
          <strong className="positive">
            {ws.students.filter((st) => st.score >= ws.pass).length}
          </strong>
        </div>
        <div>
          <span>Failed</span>
          <strong>
            {ws.students.filter((st) => st.score < ws.pass).length}
          </strong>
        </div>
        <Button icon="file" onClick={onReport}>
          View report
        </Button>
      </div>
      <section className="panel results-panel">
        <div className="results-toolbar">
          <div>
            <h2>{ws.name}</h2>
            <span>{students.length} students</span>
          </div>
          <div className="search-input">
            <Icon name="search" size={17} />
            <input
              aria-label="Search students"
              placeholder="Search by student name or D.no..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter results"
          >
            <option>All results</option>
            <option>Pass</option>
            <option>Fail</option>
          </select>
        </div>
        <div className="table-wrap">
          <table className="results-table">
            <colgroup>
              <col className="col-serial" />
              <col className="col-name" />
              <col className="col-email" />
              <col className="col-marks" />
              <col className="col-percentage" />
              <col className="col-status" />
              <col className="col-time" />
            </colgroup>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Student Name</th>
                <th>D.no</th>
                <th>Marks</th>
                <th>Percentage</th>
                <th>Status</th>
                <th>Time Taken</th>
              </tr>
            </thead>
            <tbody>
              {students.map((result) => (
                <tr key={`${result.dno}-${result.serial}`}>
                  <td>{String(result.serial).padStart(2, "0")}</td>
                  <td>
                    <div className="student-cell">
                      <Avatar
                        name={result.name}
                        small
                        color={result.serial % 2 ? "blue" : "teal"}
                      />
                      <strong>{result.name}</strong>
                    </div>
                  </td>
                  <td>{result.dno}</td>
                  <td>
                    <strong>
                      {formatMarks(result.obtainedMarks)}
                    </strong>
                    <span className="muted-text">
                      {" / "}
                      {formatMarks(result.totalMarks)}
                    </span>
                  </td>
                  <td>{result.percentage}%</td>
                  <td>
                    <Badge tone={result.passed ? "green" : "red"}>
                      {result.passed ? "PASS" : "FAIL"}
                    </Badge>
                  </td>
                  <td>{result.timeTaken}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mobile-result-list">
          {students.map((result) => (
            <div
              className="mobile-student"
              key={`${result.dno}-${result.serial}`}
            >
              <div>
                <Avatar name={result.name} color="blue" />
                <div>
                  <strong>{result.name}</strong>
                  <span>{result.dno}</span>
                </div>
                <Badge tone={result.passed ? "green" : "red"}>
                  {result.passed ? "PASS" : "FAIL"}
                </Badge>
              </div>
              <footer>
                <span>
                  Marks{" "}
                  <b>
                    {formatMarks(result.obtainedMarks)} /{" "}
                    {formatMarks(result.totalMarks)}
                  </b>
                </span>
                <span>
                  <Icon name="clock" size={13} />
                  {result.timeTaken}
                </span>
                <button onClick={() => onView(result.student)}>
                  View result
                  <Icon name="arrow" size={13} />
                </button>
              </footer>
            </div>
          ))}
        </div>
        {!students.length && (
          <div className="empty-state">
            <Icon name="users" size={30} />
            <h3>No student results found</h3>
            <p>
              {ws.students.length
                ? "Try a different search or filter."
                : "Results appear here after students submit an exam."}
            </p>
          </div>
        )}
        <div className="table-footer">
          <span>
            Showing {students.length} of {ws.students.length} students
          </span>
          <span>
            <Icon name="shield" size={13} />
            Automatically evaluated · Passing score {ws.pass}%
          </span>
        </div>
      </section>
    </>
  )
}
function StudentResult({
  student,
  ws,
  onReport,
  onStatistics,
  showReport = true,
  onBack,
}: {
  student: Student
  ws: Workspace
  onReport: () => void
  onStatistics?: () => void
  showReport?: boolean
  onBack?: () => void
}) {
  const total = ws.questions.reduce((a, q) => a + q.marks, 0)
  return (
    <div className="student-detail">
      <div className="student-detail-header">
        <Avatar name={student.name} />
        <div>
          <h2>{student.name}</h2>
          <p>D.no: {student.dno}</p>
        </div>
        <Badge tone={student.score >= ws.pass ? "green" : "red"}>
          {student.score >= ws.pass ? "Pass" : "Fail"}
        </Badge>
      </div>
      <p className="muted-text">
        {ws.name} · {ws.id}
      </p>
      <div className="result-score">
        <strong>
          {student.score}
          <small>%</small>
        </strong>
        <p>
          {((student.score / 100) * total).toFixed(1)} out of {total} marks
        </p>
      </div>
      <div className="mini-stats">
        <div>
          <span>Time taken</span>
          <strong>{student.time}</strong>
        </div>
        <div>
          <span>Passing score</span>
          <strong>{ws.pass}%</strong>
        </div>
        <div>
          <span>Questions</span>
          <strong>{ws.questions.length}</strong>
        </div>
      </div>
      {student.answers && (
        <div className="answer-review">
          <h3>Answer review</h3>
          {ws.questions.map((q, i) => (
            <div key={q.id}>
              <strong>
                {i + 1}. {q.text}
              </strong>
              <p>
                Your answer:{" "}
                {student.answers?.[i]?.join(", ") || "Not answered"}
              </p>
              {["Subjective", "Paragraph"].includes(q.type) ? (
                <small>Pending manual evaluation</small>
              ) : (
                <small>
                  Correct answer:{" "}
                  {q.type === "Fill in the Blanks"
                    ? q.options[0]
                    : q.correct.map((n) => q.options[n]).join(", ")}
                </small>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="modal-actions">
        {onBack && <Button onClick={onBack}>Back to Dashboard</Button>}
        {onStatistics && (
          <Button variant="primary" icon="chart" onClick={onStatistics}>
            Workspace Statistics
          </Button>
        )}
        {showReport && (
          <Button variant="primary" icon="file" onClick={onReport}>
            View Report
          </Button>
        )}
      </div>
    </div>
  )
}
function Report({
  ws,
  onDownload,
  onBack,
}: {
  ws: Workspace
  onDownload: () => void
  onBack: () => void
}) {
  const s = stats(ws)
  return (
    <>
      <PageHeading
        title="Exam Performance Report"
        subtitle="A complete, shareable overview of assessment performance."
      >
        <Button onClick={onBack}>Back to Results</Button>
        <Button variant="primary" icon="download" onClick={onDownload}>
          Download PDF Report
        </Button>
      </PageHeading>
      <article className="report-sheet">
        <div className="report-brand">
          <Logo />
          <span>ASSESSMENT INTELLIGENCE</span>
        </div>
        <div className="report-title">
          <span className="eyebrow">WORKSPACE PERFORMANCE REPORT</span>
          <h1>{ws.name}</h1>
          <p>
            Prepared by TestSpace ·{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="report-meta">
          {[
            ["Workspace", ws.id],
            ["Exam date", ws.date],
            ["Participants", s.total],
            ["Total questions", ws.questions.length],
            ["Total marks", ws.questions.reduce((a, q) => a + q.marks, 0)],
          ].map(([k, v]) => (
            <div key={k}>
              <span>{k}</span>
              <strong>{v}</strong>
            </div>
          ))}
        </div>
        <h2 className="report-section-title">
          01 <span>Performance summary</span>
        </h2>
        <div className="report-summary">
          {[
            ["Average score", s.avg + "%"],
            ["Highest score", s.high + "%"],
            ["Lowest score", s.low + "%"],
            ["Pass percentage", s.pass + "%"],
            ["Fail percentage", (s.total ? 100 - s.pass : 0) + "%"],
          ].map(([k, v]) => (
            <div key={k}>
              <span>{k}</span>
              <strong>{v}</strong>
            </div>
          ))}
        </div>
        <div className="report-charts">
          <section>
            <h3>Score distribution</h3>
            <Distribution ws={ws} />
          </section>
          <section>
            <h3>Pass / fail distribution</h3>
            <Donut pass={s.pass} />
          </section>
        </div>
        <h2 className="report-section-title">
          02 <span>Question-wise accuracy</span>
        </h2>
        <div className="report-question-list">
          {ws.questions.map((q, i) => {
            const responses = ws.students.filter((st) => st.answers)
            const correct = responses.filter((st) =>
              isCorrect(q, st.answers?.[i]),
            ).length
            return (
              <div key={q.id}>
                <span>Q{i + 1}</span>
                <p>{q.text}</p>
                <strong>
                  {responses.length
                    ? `${Math.round((correct / responses.length) * 100)}%`
                    : "No response data"}
                </strong>
              </div>
            )
          })}
        </div>
        <h2 className="report-section-title">
          03 <span>Detailed student results</span>
        </h2>
        <div className="table-wrap">
          <table className="report-results-table">
            <colgroup>
              <col className="col-serial" />
              <col className="col-name" />
              <col className="col-email" />
              <col className="col-marks" />
              <col className="col-percentage" />
              <col className="col-status" />
              <col className="col-time" />
            </colgroup>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Student Name</th>
                <th>D.no</th>
                <th>Marks</th>
                <th>Percentage</th>
                <th>Status</th>
                <th>Time Taken</th>
              </tr>
            </thead>
            <tbody>
              {studentResults(ws).map((result) => (
                <tr key={`${result.dno}-${result.serial}`}>
                  <td>{String(result.serial).padStart(2, "0")}</td>
                  <td>{result.name}</td>
                  <td>{result.dno}</td>
                  <td>
                    {formatMarks(result.obtainedMarks)} /{" "}
                    {formatMarks(result.totalMarks)}
                  </td>
                  <td>{result.percentage}%</td>
                  <td>
                    <Badge tone={result.passed ? "green" : "red"}>
                      {result.passed ? "PASS" : "FAIL"}
                    </Badge>
                  </td>
                  <td>{result.timeTaken}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <footer>
          Confidential • Generated by TestSpace
          <span>Page 1 of 1</span>
        </footer>
      </article>
    </>
  )
}

function Settings({
  ws,
  onSave,
  onDelete,
}: {
  ws?: Workspace
  onSave: (ws?: Workspace) => void
  onDelete: () => void
}) {
  const [name, setName] = useState(
    ws?.name || readStored("TestSpace-profile", { name: localStorage.getItem("testspace_profile_name") || "Account" }).name,
  )
  const [email, setEmail] = useState(
    readStored("TestSpace-profile", { email: "" }).email,
  )
  const [description, setDescription] = useState(ws?.description || "")
  const [password, setPassword] = useState(ws?.password || "")
  const [duration, setDuration] = useState(ws?.duration || 30)
  const [pass, setPass] = useState(ws?.pass || 60)
  const [status, setStatus] = useState(ws?.status || "Draft")
  const [expiresAt, setExpiresAt] = useState(() => {
    if (!ws?.expiresAt) return ""
    const date = new Date(ws.expiresAt)
    if (Number.isNaN(date.getTime())) return ""
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    return local.toISOString().slice(0, 16)
  })
  const [error, setError] = useState("")
  return (
    <>
      <PageHeading
        title={ws ? "Workspace Settings" : "Account Settings"}
        subtitle="Make this space work for you."
      />
      <section className="panel account-settings">
        <h2>{ws ? "Workspace details" : "Your profile"}</h2>
        <Field label={ws ? "Workspace Name" : "Full name"}>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        {ws ? (
          <>
            <Field label="Description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </Field>
            <Field label="Workspace Expiry (date & time)">
              <input
                type="datetime-local"
                value={expiresAt}
                min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
              <small>Change when this workspace should automatically expire.</small>
            </Field>
            <Field label="Workspace Password">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
              />
            </Field>
            <div className="two-fields">
              <Field label="Duration (minutes)">
                <input
                  type="number"
                  min={1}
                  max={240}
                  value={duration}
                  onChange={(e) => setDuration(+e.target.value)}
                />
              </Field>
              <Field label="Passing percentage">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={pass}
                  onChange={(e) => setPass(+e.target.value)}
                />
              </Field>
            </div>
            <Field label="Workspace status">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Draft</option>
                <option>Active</option>
                <option>Archived</option>
              </select>
            </Field>
          </>
        ) : (
          <Field label="Email address">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
        )}
        {error && <p className="form-error">{error}</p>}
        <Button
          variant="primary"
          onClick={() => {
            if (
              !name.trim() ||
              (ws &&
                (password.length < 6 ||
                  duration < 1 ||
                  duration > 240 ||
                  !expiresAt ||
                  new Date(expiresAt).getTime() <= Date.now() ||
                  pass < 1 ||
                  pass > 100))
            ) {
              setError(
                "Check your name, password (6+ characters), duration, future workspace expiry, and passing percentage.",
              )
              return
            }
            if (!ws)
              localStorage.setItem(
                "TestSpace-profile",
                JSON.stringify({ name, email }),
              )
            onSave(
              ws
                ? { ...ws, name, description, password, duration, pass, status, expiresAt: new Date(expiresAt).toISOString() }
                : undefined,
            )
          }}
        >
          Save Changes
        </Button>
      </section>
      {ws && (
        <section className="panel danger-zone">
          <h2>Danger zone</h2>
          <p>
            Deleting a workspace permanently removes all questions, submissions,
            and analytics data.
          </p>
          <Button variant="danger" icon="trash" onClick={onDelete}>
            Delete Workspace
          </Button>
        </section>
      )}
    </>
  )
}

function JoinWorkspace({
  workspaces,
  onClose,
  onJoin,
}: {
  workspaces: Workspace[]
  onClose: () => void
  onJoin: (workspace: Workspace, student: { name: string; dno: string }, token: string) => void
}) {
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")
  const [studentName, setStudentName] = useState("")
  const [dno, setDno] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
 const join = async () => {
  if (!id.trim() || !password || !studentName.trim() || !dno.trim()) {
    setError("Please enter your workspace ID, password, student name, and D.no.")
    return
  }

  try {
    setError("")

    const response = await fetch(
      `${API_BASE_URL}/api/workspaces/join`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workspaceId: id.trim(),
          password,
          studentName: studentName.trim(),
          dno: dno.trim(),
        }),
      }
    )

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Unable to join workspace")
    }

    const workspaceResponse = await fetch(
  `${API_BASE_URL}/api/student/workspaces/${encodeURIComponent(data.workspace.workspaceId)}`,
  { headers: { Authorization: `Bearer ${data.guestToken}` } }
)

const workspaceData = await workspaceResponse.json()

if (!workspaceResponse.ok || !workspaceData.success) {
  throw new Error(workspaceData.message || "Unable to load exam")
}

const w = workspaceData.workspace

const studentWorkspace: Workspace = {
  id: w.workspaceId,
  name: w.workspaceName,
  password: "",
  description: w.description || "",
  status: "Active",
  icon: "folder",
  color: "blue",
  date: new Date().toISOString().slice(0, 10),
  questions: w.questions || [],
  students: [],
  duration: Number(w.examDurationMinutes || data.workspace.examDurationMinutes || 30),
  workspaceDuration: undefined,
  expiresAt: w.expiresAt || data.workspace.expiresAt,
  pass: 60,
}

onJoin(studentWorkspace, {
  name: workspaceData.student?.studentName || data.student?.studentName || studentName.trim(),
  dno: workspaceData.student?.dno || data.student?.dno || dno.trim(),
}, data.guestToken)

  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again."
    )
  }
}
  return (
    <Modal title="Join Workspace" onClose={onClose}>
      <form onSubmit={(event) => { event.preventDefault(); join() }}>
        <p className="modal-copy">
          Enter the workspace ID and password shared by your examiner to access your assessment.
        </p>
        <Field label="Workspace ID">
          <input
            name="workspaceId"
            value={id}
            onChange={(e) => { setId(e.target.value); setError("") }}
            placeholder="e.g. TP-PY-2024"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            aria-invalid={!!error}
            aria-describedby={error ? "join-error" : undefined}
          />
        </Field>
        <Field label="Student Name">
          <input
            name="studentName"
            value={studentName}
            onChange={(e) => { setStudentName(e.target.value); setError("") }}
            placeholder="Enter your full name"
            autoComplete="name"
            maxLength={100}
            aria-invalid={!!error}
            aria-describedby={error ? "join-error" : undefined}
          />
        </Field>
        <Field label="College Registration Number (D.no)">
          <input
            name="dno"
            value={dno}
            onChange={(e) => { setDno(e.target.value); setError("") }}
            placeholder="Enter your college registration number"
            autoComplete="off"
            aria-invalid={!!error}
            aria-describedby={error ? "join-error" : undefined}
          />
        </Field>
        <Field label="Workspace Password">
          <div className="password-input">
            <input
              name="workspacePassword"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError("") }}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your workspace password"
              autoComplete="current-password"
              aria-invalid={!!error}
              aria-describedby={error ? "join-error" : undefined}
            />
            <button
              type="button"
              className="icon-button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword(!showPassword)}
            >
              <Icon name={showPassword ? "eyeOff" : "eye"} size={18} />
            </button>
          </div>
        </Field>

        {error && <p className="form-error" id="join-error" role="alert">{error}</p>}
        <div className="modal-actions">
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">
            Join Workspace
            <Icon name="arrow" size={16} />
          </Button>
        </div>
      </form>
    </Modal>
  )
}
function Exam({
  ws,
  onExit,
  onSubmit,
  initialName = "",
  initialDno = "",
  onStatistics,
}: {
  ws: Workspace
  onExit: () => void
  onSubmit: (s: Student) => void | Promise<void>
  initialName?: string
  initialDno?: string
  onStatistics?: () => void
}) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string[]>>({})
  const [seconds, setSeconds] = useState(ws.duration * 60)
  const [confirm, setConfirm] = useState(false)
  const [error, setError] = useState("")
  const [name, setName] = useState(initialName)
  const [dno, setDno] = useState(initialDno)
  const [started, setStarted] = useState(false)
  const [orders] = useState(() =>
    ws.questions.map((q) =>
      q.shuffle ? [...q.options].sort(() => Math.random() - 0.5) : q.options,
    ),
  )
  const submitted = useRef(false)
  const answersRef = useRef(answers)
  answersRef.current = answers
  const submit = async (timedOut = false) => {
    if (submitted.current) return
    const latest = answersRef.current
    if (
      !timedOut &&
      ws.questions.some(
        (q, i) => q.required && !latest[i]?.some((a) => a.trim()),
      )
    ) {
      setError(
        "Answer every required question before submitting. Use the question palette to find unanswered questions.",
      )
      return
    }
    submitted.current = true
    const total = ws.questions.reduce((a, q) => a + q.marks, 0)
    const earned = ws.questions.reduce((a, q, i) => {
      const correct = isCorrect(q, latest[i])
      return a + (correct ? q.marks : 0)
    }, 0)
    const elapsed = ws.duration * 60 - seconds

    try {
  await onSubmit({
    name: name || "Demo Student",
    dno: dno.trim(),
    score: total ? Math.round((earned / total) * 100) : 0,
    time: `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`,
    obtainedMarks: earned,
    totalMarks: total,
    answers: latest,
    submittedAt: new Date().toISOString(),
  })
} catch (err) {
  submitted.current = false
  setError(
    err instanceof Error
      ? err.message
      : "Unable to save your submission. Please try again."
  )
}
  }
  useEffect(() => {
    if (!started) return
    const timer = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(timer)
  }, [started])
  useEffect(() => {
    if (seconds === 0 && started) submit(true)
  }, [seconds, started])
  const q = ws.questions[current]
  const answered = Object.values(answers).filter((a) =>
    a.some((s) => s.trim()),
  ).length
  if (!ws.questions.length)
    return (
      <div className="exam-shell">
        <Logo />
        <div className="empty-state">
          <h2>No questions yet</h2>
          <p>Add questions to this workspace before taking an exam.</p>
          <Button onClick={onExit}>Back to Workspace</Button>
        </div>
      </div>
    )
  return (
    <div className="exam-shell">
      <header className="exam-header">
        <Logo />
        <div className="exam-name">
          <strong>{ws.name}</strong>
          <span>Assessment · {ws.questions.length} questions</span>
        </div>
        <div className={`exam-timer ${seconds < 300 ? "warning" : ""}`}>
          <Icon name="clock" size={19} />
          <strong>
            {String(Math.floor(seconds / 60)).padStart(2, "0")}:
            {String(seconds % 60).padStart(2, "0")}
          </strong>
          <span>remaining</span>
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            setConfirm(true)
            setError("")
          }}
        >
          End Test
        </Button>
      </header>
      {!started ? (
        <div className="panel exam-start">
          <span className="workspace-icon blue">
            <Icon name="book" size={28} />
          </span>
          <h1>Ready when you are.</h1>
          <p>
            You're about to take {ws.name}. Find a quiet space and take your
            time.
          </p>
          <div className="mini-stats">
            <div>
              <span>Questions</span>
              <strong>{ws.questions.length}</strong>
            </div>
            <div>
              <span>Time limit</span>
              <strong>{ws.duration} min</strong>
            </div>
            <div>
              <span>Pass score</span>
              <strong>{ws.pass}%</strong>
            </div>
          </div>
          <Field label="Your name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
            />
          </Field>
          <Field label="D.no">
            <input
              value={dno}
              onChange={(e) => setDno(e.target.value)}
              placeholder="Enter your D.no"
              autoComplete="off"
              readOnly={Boolean(initialDno)}
            />
          </Field>
          {error && <p className="form-error">{error}</p>}
          <Button
            variant="primary"
            icon="arrow"
            onClick={() => {
              if (!name.trim() || !dno.trim()) {
                setError(
                  "Enter your student name and D.no to continue.",
                )
                return
              }
              setError("")
              setStarted(true)
            }}
          >
            Start Exam
          </Button>
          {onStatistics && (
            <Button variant="secondary" icon="chart" onClick={onStatistics}>
              View Workspace Statistics
            </Button>
          )}
          <button className="text-button" onClick={onExit}>
            Back to Workspace
          </button>
        </div>
      ) : (
        <div className="exam-layout">
          <aside className="panel exam-palette">
            <h3>Question navigator</h3>
            <p>
              {answered} of {ws.questions.length} answered
            </p>
            <div className="exam-progress">
              <i
                style={{ width: `${(answered / ws.questions.length) * 100}%` }}
              />
            </div>
            <div className="palette-grid">
              {ws.questions.map((item, i) => (
                <button
                  key={item.id}
                  aria-label={`Question ${i + 1}${
                    answers[i]?.some((a) => a.trim())
                      ? ", answered"
                      : ", not answered"
                  }`}
                  className={`${
                    answers[i]?.some((a) => a.trim()) ? "answered" : ""
                  } ${current === i ? "current" : ""}`}
                  onClick={() => setCurrent(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="palette-legend">
              <span>
                <i className="legend-square answered" />
                Answered
              </span>
              <span>
                <i className="legend-square current" />
                Current
              </span>
              <span>
                <i className="legend-square" />
                Not answered
              </span>
            </div>
            <div className="exam-help">
              <Icon name="shield" size={22} />
              <p>Your answers are saved as you go. Submit when you're ready.</p>
            </div>
          </aside>
          <section className="panel exam-question">
            <div className="exam-question-top">
              <span>
                QUESTION {current + 1} OF {ws.questions.length}
              </span>
              <Badge tone="blue">{q.type}</Badge>
              <span>{q.marks} marks</span>
            </div>
            <div className="exam-question-body">
              <h2>{q.text}</h2>
              <p>
                {q.type === "Multiple Select"
                  ? "Select all correct answers."
                  : ["Subjective", "Paragraph", "Fill in the Blanks"].includes(
                        q.type,
                      )
                    ? "Enter your response below."
                    : "Choose one correct answer."}
                {q.required && <span className="required-note">Required</span>}
              </p>
              {["Subjective", "Paragraph", "Fill in the Blanks"].includes(
                q.type,
              ) ? (
                <textarea
                  rows={q.type === "Fill in the Blanks" ? 2 : 7}
                  aria-label="Your answer"
                  placeholder="Write your answer here..."
                  value={answers[current]?.[0] || ""}
                  onChange={(e) =>
                    setAnswers({ ...answers, [current]: [e.target.value] })
                  }
                />
              ) : (
                <div className="exam-options">
                  {orders[current].map((opt, i) => (
                    <label
                      className={`exam-option ${
                        answers[current]?.includes(opt) ? "selected" : ""
                      }`}
                      key={i}
                    >
                      <span className="option-letter">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{opt}</span>
                      <input
                        type={
                          q.type === "Multiple Select" ? "checkbox" : "radio"
                        }
                        name={`question-${current}`}
                        checked={answers[current]?.includes(opt) || false}
                        onChange={() =>
                          setAnswers({
                            ...answers,
                            [current]:
                              q.type === "Multiple Select"
                                ? answers[current]?.includes(opt)
                                  ? answers[current].filter((a) => a !== opt)
                                  : [...(answers[current] || []), opt]
                                : [opt],
                          })
                        }
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="exam-question-footer">
              <Button
                disabled={current === 0}
                onClick={() => setCurrent(current - 1)}
              >
                <Icon name="arrow" className="reverse" size={16} />
                Previous
              </Button>
              <span>
                {current + 1} / {ws.questions.length}
              </span>
              <Button
                variant="primary"
                onClick={() =>
                  current < ws.questions.length - 1
                    ? setCurrent(current + 1)
                    : setConfirm(true)
                }
              >
                {current === ws.questions.length - 1 ? "Submit Test" : "Next"}
                <Icon name="arrow" size={16} />
              </Button>
            </div>
          </section>
        </div>
      )}
      {confirm && (
        <Modal
          title={started ? "Submit your assessment?" : "Leave this assessment?"}
          onClose={() => setConfirm(false)}
        >
          <p className="modal-copy">
            {started
              ? `You've answered ${answered} of ${ws.questions.length} questions. Once submitted, your answers cannot be changed.`
              : "Your exam has not started. You can return to the workspace."}
          </p>
          {ws.questions.some((q) =>
            ["Subjective", "Paragraph"].includes(q.type),
          ) && (
            <div className="info-notice">
              Written answers will require manual review. The initial score
              includes only automatically evaluated answers.
            </div>
          )}
          {error && <p className="form-error">{error}</p>}
          <div className="modal-actions">
            <Button onClick={() => setConfirm(false)}>
              {started ? "Keep Working" : "Stay"}
            </Button>
            <Button
              variant="primary"
              onClick={() => (started ? submit() : onExit())}
            >
              {started ? "Submit & View Result" : "Leave Exam"}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function AuthPage({
  mode,
  navigate,
  onAuthenticated,
}: {
  mode: string
  navigate: (p: string) => void
  onAuthenticated: (token: string, name: string) => void
}) {

  const isSignup = mode === "signup"
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [forgotPassword, setForgotPassword] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setNotice("")
    if (forgotPassword) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError("Enter a valid email address.")
        return
      }
      if (password.length < 8) {
        setError("Your new password must contain at least 8 characters.")
        return
      }
      if (password !== confirmPassword) {
        setError("Your passwords do not match.")
        return
      }
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), newPassword: password }),
        })
        const data = await response.json()
        if (!response.ok || !data.success) {
          setError(data.message || "Unable to reset password.")
          return
        }
        setNotice(data.message || "Password reset successfully. Please sign in.")
        setPassword("")
        setConfirmPassword("")
        setForgotPassword(false)
      } catch {
        setError("Unable to connect to the server. Please try again.")
      }
      return
    }
    if (isSignup && !name.trim()) {
      setError("Enter your full name to continue.")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.")
      return
    }
    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.")
      return
    }
    if (isSignup && password !== confirmPassword) {
      setError("Your passwords do not match.")
      return
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/${isSignup ? "signup" : "login"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isSignup
              ? { fullName: name.trim(), email: email.trim(), password }
              : { email: email.trim(), password }
          ),
        }
      )
      const data = await response.json()
      if (!response.ok || !data.success) {
        setError(data.message || "Authentication failed.")
        return
      }
      if (isSignup) {
        localStorage.setItem("testspace_profile_name", name.trim())
        localStorage.setItem("testspace_profile_email", email.trim().toLowerCase())
        setNotice("Account created successfully. Please sign in.")
        setPassword("")
        setConfirmPassword("")
        navigate("login")
        return
      }
      if (!data.token) {
        setError("Login response did not contain an authentication token.")
        return
      }
      const signedInName =
        data.user?.fullName ||
        data.user?.name ||
        (localStorage.getItem("testspace_profile_email") === email.trim().toLowerCase()
          ? localStorage.getItem("testspace_profile_name")
          : "") ||
        email.trim().split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())
      onAuthenticated(data.token, signedInName)
    } catch {
      setError("Unable to connect to the server. Please try again.")
    }
  }

  return (
    <div className="auth-page">
      <header className="auth-nav">
        <button className="logo-button" onClick={() => navigate("landing")} aria-label="Back to Test Space home">
          <Logo />
        </button>
        <button className="auth-home-link" onClick={() => navigate("landing")}>
          Back to home
        </button>
      </header>
      <main className="auth-layout">
        <section className="auth-intro">
          <span className="auth-eyebrow"><i /> TEST SPACE ACCOUNT</span>
          <h1>{isSignup ? "One account. Every assessment." : "Welcome back."}</h1>
          <p>{isSignup ? "Create your account to build workspaces, join assessments, and keep your learning organized." : "Sign in to continue to your workspaces and assessments."}</p>
          <div className="auth-benefits">
            <div><span><Icon name="shield" size={17} /></span><div><b>Private by design</b><small>Your workspaces stay under your control.</small></div></div>
            <div><span><Icon name="layers" size={17} /></span><div><b>One account for everyone</b><small>Create assessments or join them with the same account.</small></div></div>
            <div><span><Icon name="chart" size={17} /></span><div><b>Everything in one place</b><small>Questions, submissions, and results stay organized.</small></div></div>
          </div>
        </section>
        <section className="auth-card panel">
          <div className="auth-card-heading">
            <span className="auth-card-mark"><Logo small /></span>
            <h2>{isSignup ? "Create your account" : "Sign in to Test Space"}</h2>
            <p>{isSignup ? "Get started with your free account." : "Enter your details to access your account."}</p>
          </div>
          <form onSubmit={submit}>
            {isSignup && <Field label="Full name"><input autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" /></Field>}
            <Field label="Email address"><input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></Field>
            <Field label={forgotPassword ? "New password" : "Password"}>
              <div className="auth-password-wrap">
                <input type={showPassword ? "text" : "password"} autoComplete={isSignup || forgotPassword ? "new-password" : "current-password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" />
                <button type="button" className="auth-password-toggle" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? "Hide password" : "Show password"}><Icon name={showPassword ? "eyeOff" : "eye"} size={17} /></button>
              </div>
            </Field>
            {(isSignup || forgotPassword) && <Field label={forgotPassword ? "Confirm new password" : "Confirm password"}><input type="password" autoComplete="new-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" /></Field>}
            {!isSignup && !forgotPassword && <div className="auth-forgot-row"><button type="button" onClick={() => { setError(""); setNotice(""); setPassword(""); setConfirmPassword(""); setForgotPassword(true); }}>Forgot password?</button></div>}
            {error && <p className="auth-message error" role="alert">{error}</p>}
            {notice && <p className="auth-message notice" role="status">{notice}</p>}
            <Button type="submit" variant="primary" className="auth-submit">{forgotPassword ? "Reset password" : isSignup ? "Create account" : "Sign in"}<Icon name="arrow" size={16} /></Button>
          </form>
          <p className="auth-switch">{forgotPassword ? "Remembered your password?" : isSignup ? "Already have an account?" : "New to Test Space?"} <button onClick={() => { if (forgotPassword) { setForgotPassword(false); setError(""); setNotice(""); setPassword(""); setConfirmPassword(""); } else navigate(isSignup ? "login" : "signup") }}>{forgotPassword ? "Back to sign in" : isSignup ? "Sign in" : "Create Test Space Account"}</button></p>
          <p className="auth-terms">By continuing, you agree to use Test Space responsibly and keep your account credentials secure.</p>
        </section>
      </main>
      <footer className="auth-footer"><Logo small /><span>Thoughtful assessments. Meaningful progress.</span></footer>
    </div>
  )
}

function Landing({
  navigate,
  join,
}: {
  navigate: (p: string) => void
  join: () => void
}) {
  const [mobileNav, setMobileNav] = useState(false)
  const go = (id: string) => {
    setMobileNav(false)
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }
  return (
    <div className="landing">
      <header className="landing-nav">
        <button
          className="logo-button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <Logo />
        </button>
        <nav className={mobileNav ? "open" : ""}>
          {["Home", "Features", "How It Works", "Pricing", "About"].map((n) => (
            <button
              key={n}
              onClick={() => go(n.toLowerCase().replace(/ /g, "-"))}
            >
              {n}
            </button>
          ))}
        </nav>
        <div>
          <button className="text-button" onClick={join}>
            Join Workspace
          </button>
          <Button onClick={() => navigate("login")}>Login</Button>
          <Button variant="primary" onClick={() => navigate("signup")}>
            Get Started
            <Icon name="arrow" size={15} />
          </Button>
          <button
            className="icon-button mobile-menu"
            aria-label="Toggle navigation"
            onClick={() => setMobileNav(!mobileNav)}
          >
            <Icon name="menu" />
          </button>
        </div>
      </header>
      <section className="landing-hero" id="home">
        <div className="hero-content">
          <span className="hero-label">
            <span /> BETTER ASSESSMENTS. BRIGHTER POSSIBILITIES.
          </span>
          <h1>
            Create Exams.
            <br />
            Manage Easily.
            <br />
            <span>Analyze Smarter.</span>
          </h1>
          <p>
            From your first question to your next big insight. Create secure
            workspaces, deliver seamless exams, and turn results into real
            progress.
          </p>
          <div className="hero-buttons">
            <Button variant="primary" onClick={() => navigate("signup")}>
              Get Started Free
              <Icon name="arrow" size={17} />
            </Button>
            <Button icon="play" onClick={() => navigate("dashboard")}>
              Watch Demo
            </Button>
          </div>
          <div className="hero-reassurance">
            <Icon name="check" size={15} />
            No credit card required <span>·</span>
            <Icon name="check" size={15} />
            Ready in minutes
          </div>
        </div>
        <div className="hero-visual">
          <div className="mockup-browser">
            <div className="mockup-browser-bar">
              <div>
                <i />
                <i />
                <i />
              </div>
              <span>
                <Icon name="shield" size={10} />
                app.testspace.com
              </span>
              <Icon name="plus" size={12} />
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar">
                <Logo small />
                {[
                  "grid",
                  "folder",
                  "question",
                  "users",
                  "chart",
                  "settings",
                ].map((ic, i) => (
                  <div className={i === 1 ? "active" : ""} key={ic}>
                    <Icon name={ic as IconName} size={13} />
                    <span>
                      {
                        [
                          "Dashboard",
                          "Workspaces",
                          "Question Bank",
                          "Students",
                          "Reports",
                          "Settings",
                        ][i]
                      }
                    </span>
                  </div>
                ))}
              </div>
              <div className="mockup-content">
                <div className="mockup-top">
                  <span>Workspace / Overview</span>
                  <Avatar small />
                </div>
                <h3>My Workspaces</h3>
                <p>Your assessments. All in one place.</p>
                <div className="mockup-metrics">
                  {[
                    ["Workspaces", "04"],
                    ["Students", "248"],
                    ["Avg. score", "78%"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <span>{k}</span>
                      <b>{v}</b>
                    </div>
                  ))}
                </div>
                <div className="mockup-cards">
                  {seedWorkspaces.map((w) => (
                    <div key={w.id}>
                      <span className={`workspace-icon mini ${w.color}`}>
                        <Icon name={w.icon} size={15} />
                      </span>
                      <Badge tone={w.status === "Active" ? "green" : "amber"}>
                        {w.status}
                      </Badge>
                      <h4>{w.name}</h4>
                      <p>{w.id}</p>
                      <div>
                        <span>12 Questions</span>
                        <span>62 Students</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mockup-chart">
                  <h4>Performance overview</h4>
                  <LineChart compact />
                </div>
              </div>
            </div>
          </div>
          <div className="floating-insight">
            <span className="metric-icon teal">
              <Icon name="trend" size={22} />
            </span>
            <div>
              <strong>Clarity in every result.</strong>
              <span>Built-in analytics. Better decisions.</span>
            </div>
          </div>
          <div className="laptop-base" />
        </div>
      </section>
      <div className="trust-line">
        PURPOSE-BUILT FOR EDUCATORS, TEAMS, AND THE NEXT GENERATION OF TALENT
      </div>
      <section className="landing-features" id="features">
        {[
          {
            icon: "question",
            title: "Multiple Question Types",
            text: "From multiple choice to in-depth written responses. Assess every kind of knowledge.",
          },
          {
            icon: "shield",
            title: "Secure Workspaces",
            text: "Separate environments. Private credentials. Every assessment in its own safe space.",
          },
          {
            icon: "chart",
            title: "Detailed Analytics",
            text: "See beyond the score with performance trends and question-level insights.",
          },
          {
            icon: "download",
            title: "Download Reports",
            text: "Turn results into polished PDF reports, ready to share with your team.",
          },
        ].map((f) => (
          <div className="panel" key={f.title}>
            <span className="workspace-icon blue">
              <Icon name={f.icon as IconName} size={23} />
            </span>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </section>
      <section className="how-section" id="how-it-works">
        <span className="eyebrow">A SIMPLER WAY TO ASSESS</span>
        <h2>From setup to insight. Seamlessly.</h2>
        <div>
          {[
            [
              "01",
              "Create your space",
              "Set up a secure workspace and invite your students.",
            ],
            [
              "02",
              "Build your assessment",
              "Choose question types, assign marks, and set the rules.",
            ],
            [
              "03",
              "Let insights take over",
              "Automatically evaluate submissions and explore the results.",
            ],
          ].map(([num, title, text]) => (
            <article key={num}>
              <span>{num}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="landing-pricing panel" id="pricing">
        <div>
          <span className="eyebrow">BUILT TO GROW WITH YOU</span>
          <h2>Start free. Assess with confidence.</h2>
          <p>
            Your first workspace, unlimited potential. No credit card needed.
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate("signup")}>
          Create Your Free Workspace
          <Icon name="arrow" size={17} />
        </Button>
      </section>
      <footer className="landing-footer" id="about">
        <Logo />
        <p>Thoughtful assessments. Meaningful progress.</p>
        <span>© {new Date().getFullYear()} TestSpace. All rights reserved.</span>
      </footer>
    </div>
  )
}

function savePDF(ws: Workspace) {
  const s = stats(ws)
  const total = ws.questions.reduce((a, q) => a + q.marks, 0)
  const rows = studentResults(ws)
  const escape = (str: string) =>
    str
      .replace(/•/g, "\\225")
      .replace(/[^\x20-\x7E\\]/g, "-")
      .replace(/([()])/g, "\\$1")
  const text = (
    value: string,
    x: number,
    y: number,
    size = 8,
    font = "F1",
    color = "0.22 0.29 0.4",
  ) =>
    `${color} rg BT /${font} ${size} Tf ${x} ${y} Td (${escape(value)}) Tj ET\n`
  const wrap = (value: string, width: number, size = 8) => {
    const limit = Math.max(5, Math.floor(width / (size * 0.52)))
    const words = value.split(/\s+/).flatMap((word) => {
      if (word.length <= limit) return [word]
      return Array.from(
        { length: Math.ceil(word.length / limit) },
        (_, i) => word.slice(i * limit, (i + 1) * limit),
      )
    })
    const lines: string[] = []
    words.forEach((word) => {
      const current = lines.at(-1)
      if (!current || `${current} ${word}`.length > limit) lines.push(word)
      else lines[lines.length - 1] = `${current} ${word}`
    })
    return lines.length ? lines : [""]
  }
  const pages: string[] = [""]
  let pageIndex = 0
  let y = 790
  const add = (command: string) => {
    pages[pageIndex] += command
  }
  const newPage = () => {
    pages.push("")
    pageIndex += 1
    y = 790
    add(text(`TESTSPACE  /  ${ws.name}`, 32, 808, 8, "F2", "0.2 0.43 0.75"))
  }
  add("0.96 0.97 0.99 rg 0 0 595 842 re f\n")
  add(text("TESTSPACE", 32, 798, 10, "F2", "0.2 0.43 0.75"))
  add(text("EXAM PERFORMANCE REPORT", 32, 760, 20, "F2", "0.1 0.17 0.28"))
  add(text(ws.name, 32, 735, 13, "F1", "0.31 0.39 0.5"))
  add(text(`Workspace ${ws.id}   |   Exam date ${ws.date}`, 32, 714, 8))
  add("0.9 0.93 0.97 rg 32 644 531 50 re f\n")
  ;[
    ["PARTICIPANTS", String(s.total)],
    ["AVERAGE", `${s.avg}%`],
    ["HIGHEST", `${s.high}%`],
    ["PASS RATE", `${s.pass}%`],
    ["TOTAL MARKS", String(total)],
  ].forEach(([label, value], index) => {
    const x = 43 + index * 104
    add(text(label, x, 677, 6.5, "F2", "0.4 0.48 0.58"))
    add(text(value, x, 655, 13, "F2", "0.12 0.2 0.32"))
  })
  add(text("DETAILED STUDENT RESULTS", 32, 612, 11, "F2", "0.12 0.2 0.32"))
  y = 588

  const columns = [
    { label: "S.No", width: 34, align: "center" },
    { label: "Student Name", width: 91, align: "left" },
    { label: "D.no", width: 145, align: "left" },
    { label: "Marks", width: 67, align: "center" },
    { label: "Percentage", width: 69, align: "center" },
    { label: "Status", width: 56, align: "center" },
    { label: "Time Taken", width: 69, align: "center" },
  ] as const
  const tableX = 32
  const centeredX = (value: string, x: number, width: number, size = 7) =>
    x + Math.max(3, (width - value.length * size * 0.5) / 2)
  const tableHeader = () => {
    add(`0.86 0.9 0.95 rg ${tableX} ${y - 27} 531 27 re f\n`)
    let x = tableX
    columns.forEach((column) => {
      const tx =
        column.align === "center"
          ? centeredX(column.label, x, column.width, 6.5)
          : x + 6
      add(text(column.label, tx, y - 17, 6.5, "F2", "0.25 0.34 0.46"))
      x += column.width
    })
    y -= 27
  }
  tableHeader()
  rows.forEach((row, index) => {
    const values = [
      String(row.serial).padStart(2, "0"),
      row.name,
      row.dno,
      `${formatMarks(row.obtainedMarks)} / ${formatMarks(row.totalMarks)}`,
      `${row.percentage}%`,
      row.passed ? "PASS" : "FAIL",
      row.timeTaken,
    ]
    const wrapped = values.map((value, columnIndex) =>
      wrap(value, columns[columnIndex].width - 12, 7),
    )
    const rowHeight = Math.max(29, Math.max(...wrapped.map((line) => line.length)) * 9 + 12)
    if (y - rowHeight < 48) {
      newPage()
      tableHeader()
    }
    if (index % 2 === 1)
      add(`0.93 0.95 0.98 rg ${tableX} ${y - rowHeight} 531 ${rowHeight} re f\n`)
    add(`0.82 0.86 0.91 RG 0.45 w ${tableX} ${y - rowHeight} m 563 ${y - rowHeight} l S\n`)
    let x = tableX
    wrapped.forEach((lines, columnIndex) => {
      const column = columns[columnIndex]
      if (columnIndex === 5) {
        const badgeWidth = 35
        const badgeX = x + (column.width - badgeWidth) / 2
        const badgeY = y - rowHeight / 2 - 7
        add(
          row.passed
            ? `0.02 0.38 0.20 rg ${badgeX} ${badgeY} ${badgeWidth} 14 re f\n`
            : `0.65 0.05 0.10 rg ${badgeX} ${badgeY} ${badgeWidth} 14 re f\n`,
        )
        add(
          text(
            values[columnIndex],
            centeredX(values[columnIndex], x, column.width, 6.5),
            badgeY + 4,
            6.5,
            "F2",
            "1 1 1",
          ),
        )
      } else {
        lines.forEach((line, lineIndex) => {
          const tx =
            column.align === "center"
              ? centeredX(line, x, column.width, 7)
              : x + 6
          const textY =
            y - rowHeight / 2 + ((lines.length - 1) * 9) / 2 - lineIndex * 9 - 2.5
          add(text(line, tx, textY, 7))
        })
      }
      x += column.width
    })
    y -= rowHeight
  })
  if (!rows.length) add(text("No student submissions available.", 38, y - 22, 8))

  pages.forEach((_, index) => {
    pages[index] +=
      "0.82 0.86 0.91 RG 0.5 w 32 31 m 563 31 l S\n" +
      text("Confidential • Generated by TestSpace", 32, 17, 7, "F1", "0.42 0.48 0.57") +
      text(`Page ${index + 1} of ${pages.length}`, 505, 17, 7, "F1", "0.42 0.48 0.57")
  })
  const objects: string[] = []
  const pageIds = pages.map((_, i) => 5 + i * 2)
  objects.push("<< /Type /Catalog /Pages 2 0 R >>")
  objects.push(
    `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pages.length} >>`,
  )
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>")
  pages.forEach((stream, i) => {
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${pageIds[i] + 1} 0 R >>`,
    )
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}endstream`)
  })
  let pdf = "%PDF-1.4\n"
  const offsets = [0]
  objects.forEach((obj, i) => {
    offsets.push(pdf.length)
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`
  })
  const start = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets
    .slice(1)
    .map((o) => `${String(o).padStart(10, "0")} 00000 n \n`)
    .join(
      "",
    )}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`
  const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }))
  const a = document.createElement("a")
  a.href = url
  a.download = `TestSpace-${ws.id}-Report.pdf`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
