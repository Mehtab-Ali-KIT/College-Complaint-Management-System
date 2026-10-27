const Complaint = require("../models/Complaint");
const Assignment = require("../models/Assignment");
const Feedback = require("../models/Feedback");

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


// GET SINGLE COMPLAINT BY ID (Supports Student, Staff, Admin)
const getComplaintById = async (req, res) => {
    try {
        const query = { _id: req.params.id };

        // If student, restrict to their own complaint
        if (req.user.role === "student") {
            query.student = req.user.id;
        }

        const complaint = await Complaint.findOne(query)
            .populate("student", "name email phone")
            .populate("category", "name description");

        // Complaint not found
        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found or unauthorized access"
            });
        }

        // Fetch assignment details if any
        const assignment = await Assignment.findOne({ complaint: complaint._id })
            .populate("assignedTo", "name email phone")
            .populate("assignedBy", "name email");

        // Fetch feedback if any
        const feedback = await Feedback.findOne({ complaint: complaint._id });

        res.status(200).json({
            success: true,
            complaint,
            assignment: assignment || null,
            feedback: feedback || null
        });

    } catch (error) {
        console.error("GET COMPLAINT BY ID ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// GET ALL COMPLAINTS - ADMIN & STAFF
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
    return getComplaintById(req, res);
};

// UPDATE COMPLAINT STATUS (ADMIN & STAFF)
const updateComplaintStatus = async (req, res) => {
    try {
        const { status, resolutionNotes } = req.body;

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
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        // Update status & resolution notes
        complaint.status = status;
        if (resolutionNotes !== undefined) {
            complaint.resolutionNotes = resolutionNotes;
        }

        // Set resolvedAt when complaint is resolved or closed
        if (status === "Resolved" || status === "Closed") {
            if (!complaint.resolvedAt) {
                complaint.resolvedAt = new Date();
            }
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
        console.error("UPDATE COMPLAINT STATUS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// SUBMIT FEEDBACK FOR RESOLVED COMPLAINT (STUDENT)
const submitFeedback = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating between 1 and 5 is required"
            });
        }

        const complaint = await Complaint.findOne({
            _id: req.params.id,
            student: req.user.id
        });

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        // Check if feedback already submitted
        let feedback = await Feedback.findOne({ complaint: complaint._id });

        if (feedback) {
            feedback.rating = rating;
            feedback.comment = comment || "";
            await feedback.save();
        } else {
            feedback = await Feedback.create({
                complaint: complaint._id,
                student: req.user.id,
                rating,
                comment: comment || ""
            });
        }

        res.status(200).json({
            success: true,
            message: "Feedback submitted successfully!",
            feedback
        });

    } catch (error) {
        console.error("SUBMIT FEEDBACK ERROR:", error);
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
    updateComplaintStatus,
    submitFeedback
};
