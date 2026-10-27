const express = require("express");

const {
    createComplaint,
    getMyComplaints,
    getComplaintById,
    getAllComplaints,
    updateComplaintStatus,
    getAdminComplaintById,
    submitFeedback
} = require("../controllers/complaintController");

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();


// Student creates complaint
router.post(
    "/",
    protect,
    authorizeRoles("student"),
    createComplaint
);


// Student views own complaints
router.get(
    "/my",
    protect,
    authorizeRoles("student"),
    getMyComplaints
);


// Admin / Staff views all complaints
router.get(
    "/",
    protect,
    authorizeRoles("admin", "staff"),
    getAllComplaints
);

// Admin views single complaint
router.get(
    "/admin/:id",
    protect,
    authorizeRoles("admin", "staff"),
    getAdminComplaintById
);


// Admin & Staff update complaint status
router.put(
    "/:id/status",
    protect,
    authorizeRoles("admin", "staff"),
    updateComplaintStatus
);

// Student submits feedback for complaint
router.post(
    "/:id/feedback",
    protect,
    authorizeRoles("student"),
    submitFeedback
);


// View single complaint (Student, Staff, Admin)
router.get(
    "/:id",
    protect,
    authorizeRoles("student", "staff", "admin"),
    getComplaintById
);


module.exports = router;