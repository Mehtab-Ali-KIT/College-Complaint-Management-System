const Category = require("../models/Category");

// GET ALL CATEGORIES
const getCategories = async (req, res) => {
    try {

        const categories = await Category.find({
            isActive: true
        }).sort({ name: 1 });

        res.status(200).json({
            success: true,
            categories
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// CREATE CATEGORY
const createCategory = async (req, res) => {
    try {

        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        const existingCategory = await Category.findOne({
            name
        });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Category already exists"
            });
        }

        const category = await Category.create({
            name,
            description
        });

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    getCategories,
    createCategory
};