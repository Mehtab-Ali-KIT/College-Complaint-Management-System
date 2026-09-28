const User = require("../models/User");
const bcrypt = require("bcryptjs");

// GET ALL STAFF
const getAllStaff = async (req, res) => {
    try {
        const staff = await User.find({
            role: "staff"
        }).select("-password");

        res.status(200).json({
            success: true,
            staff
        });

    } catch (error) {
        console.error("GET STAFF ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// CREATE STAFF
const createStaff = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone
        } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create staff
        const staff = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "staff",
            phone: phone || ""
        });

        res.status(201).json({
            success: true,
            message: "Staff created successfully",
            staff: {
                id: staff._id,
                name: staff.name,
                email: staff.email,
                role: staff.role,
                phone: staff.phone
            }
        });

    } catch (error) {
        console.error("CREATE STAFF ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    getAllStaff,
    createStaff
};