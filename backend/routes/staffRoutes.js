const express = require("express");

const {
    getAllStaff,
    createStaff
} = require("../controllers/staffController");

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();


// Admin can view all staff
router.get(
    "/",
    protect,
    authorizeRoles("admin"),
    getAllStaff
);


// Admin can create staff
router.post(
    "/",
    protect,
    authorizeRoles("admin"),
    createStaff
);


module.exports = router;