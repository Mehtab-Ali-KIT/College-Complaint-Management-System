const express = require("express");

const {
    assignComplaint,
    getMyAssignedComplaints
} = require("../controllers/assignmentController");

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/my",
    protect,
    authorizeRoles("staff"),
    getMyAssignedComplaints
);

// Admin assigns complaint to staff
router.post(
    "/",
    protect,
    authorizeRoles("admin"),
    assignComplaint
);

module.exports = router;