const Assignment = require("../models/Assignment");
const Complaint = require("../models/Complaint");
const User = require("../models/User");

// ASSIGN COMPLAINT TO STAFF
const assignComplaint = async (req, res) => {
    try {
        const { complaintId, staffId, remarks } = req.body;

        // Required fields
        if (!complaintId || !staffId) {
            return res.status(400).json({
                success: false,
                message: "Complaint ID and Staff ID are required"
            });
        }

        // Check complaint
        const complaint = await Complaint.findById(complaintId);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        // Check staff
        const staff = await User.findOne({
            _id: staffId,
            role: "staff"
        });

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff member not found"
            });
        }

        // Check existing assignment
        let assignment = await Assignment.findOne({
            complaint: complaintId
        });

        if (assignment) {
            assignment.assignedTo = staffId;
            assignment.assignedBy = req.user.id;
            if (remarks) assignment.remarks = remarks;
            assignment.assignedAt = new Date();
            await assignment.save();
        } else {
            // Create assignment
            assignment = await Assignment.create({
                complaint: complaintId,
                assignedTo: staffId,
                assignedBy: req.user.id,
                remarks: remarks || ""
            });
        }

        // Update complaint status if pending
        if (complaint.status === "Pending") {
            complaint.status = "Assigned";
            await complaint.save();
        }

        // Populate assignment details
        const populatedAssignment = await Assignment.findById(assignment._id)
            .populate("complaint")
            .populate("assignedTo", "name email phone")
            .populate("assignedBy", "name email");

        res.status(200).json({
            success: true,
            message: "Complaint assigned successfully",
            assignment: populatedAssignment
        });

    } catch (error) {
        console.error("ASSIGN COMPLAINT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// GET ASSIGNED COMPLAINTS FOR STAFF
const getMyAssignedComplaints = async (req, res) => {
    try {
        const assignments = await Assignment.find({
            assignedTo: req.user.id
        })
            .populate({
                path: "complaint",
                populate: [
                    { path: "student", select: "name email phone" },
                    { path: "category", select: "name" }
                ]
            })
            .populate("assignedBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            assignments
        });

    } catch (error) {
        console.error("GET ASSIGNED COMPLAINTS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    assignComplaint,
    getMyAssignedComplaints
};