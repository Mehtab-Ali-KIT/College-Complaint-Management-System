const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const staffRoutes = require("./routes/staffRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/assignments", assignmentRoutes);


// ===============================
// Protected Student Dashboard
// ===============================

const {
    protect,
    authorizeRoles
} = require("./middleware/authMiddleware");

app.get(
    "/api/student/dashboard",
    protect,
    authorizeRoles("student"),
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome to Student Dashboard",
            user: req.user
        });
    }
);


// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "College Complaint Management System API is running"
    });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});