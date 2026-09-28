const Complaint = require("../models/Complaint");

// CREATE COMPLAINT
const createComplaint = async (req, res) => {
    try {
        const {
            category,
            department,
            subject,
            description,
            priority
        } = req.body;

        // Validation
        if (!category || !subject || !description) {
            return res.status(400).json({
                success: false,
                message: "Category, subject and description are required"
            });
        }

        // Generate complaint ID
        const complaintId = "CMP-" + Date.now();

        // Create complaint
        const complaint = await Complaint.create({
            complaintId,
            student: req.user.id,
            category,
            department: department || null,
            subject,
            description,
            priority: priority || "Medium",
            status: "Pending"
        });

        res.status(201).json({
            success: true,
            message: "Complaint submitted successfully",
            complaint
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// GET MY COMPLAINTS
const getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({
            student: req.user.id
        })
            .populate("category", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            complaints
        });

    } catch (error) {
        console.error("GET MY COMPLAINTS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// GET SINGLE COMPLAINT BY ID
const getComplaintById = async (req, res) => {
    try {

        const complaint = await Complaint.findOne({
            _id: req.params.id,
            student: req.user.id
        })
            .populate("category", "name");

        // Complaint not found
        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        res.status(200).json({
            success: true,
            complaint
        });

    } catch (error) {
        console.error("GET COMPLAINT BY ID ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// GET ALL COMPLAINTS - ADMIN
const getAllComplaints = async (req, res) => {
    try {

        const complaints = await Complaint.find()
            .populate("student", "name email")
            .populate("category", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            complaints
        });

    } catch (error) {

        console.error("GET ALL COMPLAINTS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// GET SINGLE COMPLAINT - ADMIN
const getAdminComplaintById = async (req, res) => {
    try {

        const complaint = await Complaint.findById(req.params.id)
            .populate("student", "name email")
            .populate("category", "name");

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        res.status(200).json({
            success: true,
            complaint
        });

    } catch (error) {

        console.error("GET ADMIN COMPLAINT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// UPDATE COMPLAINT STATUS - ADMIN
const updateComplaintStatus = async (req, res) => {
    try {

        const { status } = req.body;

        const allowedStatuses = [
            "Pending",
            "Assigned",
            "In Progress",
            "Resolved",
            "Closed"
        ];

        // Validate status
        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid complaint status"
            });
        }

        // Find complaint
        const complaint = await Complaint.findById(
            req.params.id
        );

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        // Update status
        complaint.status = status;

        // Set resolvedAt when complaint is resolved
        if (status === "Resolved" || status === "Closed") {
            complaint.resolvedAt = new Date();
        } else {
            complaint.resolvedAt = null;
        }

        await complaint.save();

        res.status(200).json({
            success: true,
            message: "Complaint status updated successfully",
            complaint
        });

    } catch (error) {

        console.error(
            "UPDATE COMPLAINT STATUS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// EXPORT
module.exports = {
    createComplaint,
    getMyComplaints,
    getComplaintById,
    getAllComplaints,
    getAdminComplaintById,
    updateComplaintStatus
};
