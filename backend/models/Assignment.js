const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
    {
        complaint: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Complaint",
            required: true
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        assignedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        assignedAt: {
            type: Date,
            default: Date.now
        },

        remarks: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Assignment", assignmentSchema);