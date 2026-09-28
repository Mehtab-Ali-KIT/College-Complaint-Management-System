const express = require("express");

const {
    createComplaint,
    getMyComplaints,
    getComplaintById,
    getAllComplaints,
    updateComplaintStatus,
    getAdminComplaintById
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


// Admin views all complaints
router.get(
    "/",
    protect,
    authorizeRoles("admin"),
    getAllComplaints
);

// Admin views single complaint
router.get(
    "/admin/:id",
    protect,
    authorizeRoles("admin"),
    getAdminComplaintById
);


// Admin updates complaint status
router.put(
    "/:id/status",
    protect,
    authorizeRoles("admin"),
    updateComplaintStatus
);


// Student views single complaint
router.get(
    "/:id",
    protect,
    authorizeRoles("student"),
    getComplaintById
);


module.exports = router;