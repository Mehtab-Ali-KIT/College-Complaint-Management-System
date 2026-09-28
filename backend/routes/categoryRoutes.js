const express = require("express");

const {
    getCategories,
    createCategory
} = require("../controllers/categoryController");

const {
    protect,
    authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();


// Get categories
router.get("/", getCategories);


// Admin can create category
router.post(
    "/",
    protect,
    authorizeRoles("admin"),
    createCategory
);


module.exports = router;