const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Category = require("./models/Category");
const Complaint = require("./models/Complaint");
const Assignment = require("./models/Assignment");
const Feedback = require("./models/Feedback");

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/college_complaint_db");
        console.log("Connected to MongoDB for seeding...");

        // Clear existing data
        await User.deleteMany({});
        await Category.deleteMany({});
        await Complaint.deleteMany({});
        await Assignment.deleteMany({});
        await Feedback.deleteMany({});

        console.log("Cleared existing data.");

        // Create Passwords
        const adminPass = await bcrypt.hash("admin123", 10);
        const staffPass = await bcrypt.hash("staff123", 10);
        const studentPass = await bcrypt.hash("student123", 10);

        // Create Users
        const admin = await User.create({
            name: "Dr. Robert Vance (Admin)",
            email: "admin@college.edu",
            password: adminPass,
            role: "admin",
            phone: "+1 555-0192"
        });

        const staff1 = await User.create({
            name: "John Miller (IT Supervisor)",
            email: "staff1@college.edu",
            password: staffPass,
            role: "staff",
            phone: "+1 555-0144"
        });

        const staff2 = await User.create({
            name: "Sarah Jenkins (Hostel Warden)",
            email: "staff2@college.edu",
            password: staffPass,
            role: "staff",
            phone: "+1 555-0188"
        });

        const student1 = await User.create({
            name: "Alex Johnson",
            email: "student1@college.edu",
            password: studentPass,
            role: "student",
            phone: "+1 555-0101"
        });

        const student2 = await User.create({
            name: "Emily Davis",
            email: "student2@college.edu",
            password: studentPass,
            role: "student",
            phone: "+1 555-0102"
        });

        console.log("Created Users successfully.");

        // Create Categories
        const cat1 = await Category.create({
            name: "IT & Wi-Fi Network",
            description: "Issues related to campus Wi-Fi, lab computers, portal login, and server downtime."
        });

        const cat2 = await Category.create({
            name: "Hostel & Facilities",
            description: "Hostel room maintenance, water supply, electricity, and cleanliness."
        });

        const cat3 = await Category.create({
            name: "Academics & Examination",
            description: "Schedule conflicts, grade updates, hall tickets, and classroom equipment."
        });

        const cat4 = await Category.create({
            name: "Canteen & Food Hygiene",
            description: "Food quality, pricing, hygiene standards, and seating."
        });

        const cat5 = await Category.create({
            name: "Library Services",
            description: "Book availability, quiet zones, digital library access, and library cards."
        });

        console.log("Created Categories successfully.");

        // Create Sample Complaints
        const comp1 = await Complaint.create({
            complaintId: "CMP-1001",
            student: student1._id,
            category: cat1._id,
            subject: "Hostel Block B Wi-Fi disconnects frequently during evening hours",
            description: "The Wi-Fi network in Hostel Block B, 3rd floor experiences severe packet loss and drops connection every 10 minutes between 7 PM and 11 PM. Impeding online assignments.",
            priority: "High",
            status: "Assigned"
        });

        const comp2 = await Complaint.create({
            complaintId: "CMP-1002",
            student: student1._id,
            category: cat2._id,
            subject: "Water leak in Room 204 bathroom ceiling",
            description: "Water is continuously dripping from the ceiling in the Room 204 bathroom. Please send maintenance technician as soon as possible.",
            priority: "Medium",
            status: "Pending"
        });

        const comp3 = await Complaint.create({
            complaintId: "CMP-1003",
            student: student2._id,
            category: cat3._id,
            subject: "Projector lamp flickering in Audio Visual Lab 2",
            description: "During lectures in AV Lab 2, the projector light flickers violently making slides unreadable.",
            priority: "Low",
            status: "In Progress"
        });

        const comp4 = await Complaint.create({
            complaintId: "CMP-1004",
            student: student2._id,
            category: cat5._id,
            subject: "Missing reference books for Computer Networks 4th Ed",
            description: "The library stock only has 2 copies of Computer Networks 4th Edition for 120 students.",
            priority: "Medium",
            status: "Resolved",
            resolutionNotes: "Procured 15 new physical copies and activated digital e-book access for all 4th year CSE students.",
            resolvedAt: new Date(Date.now() - 86400000)
        });

        // Create Assignments
        await Assignment.create({
            complaint: comp1._id,
            assignedTo: staff1._id,
            assignedBy: admin._id,
            remarks: "Inspect AP-04 router on 3rd floor corridor."
        });

        await Assignment.create({
            complaint: comp3._id,
            assignedTo: staff1._id,
            assignedBy: admin._id,
            remarks: "Replace bulb module for AV Lab 2 projector."
        });

        await Assignment.create({
            complaint: comp4._id,
            assignedTo: staff2._id,
            assignedBy: admin._id,
            remarks: "Coordinated with publisher representative."
        });

        // Add Feedback for comp4
        await Feedback.create({
            complaint: comp4._id,
            student: student2._id,
            rating: 5,
            comment: "Thank you for the quick resolution! Digital access is super helpful."
        });

        console.log("Created Sample Complaints & Assignments successfully.");
        console.log("\n==========================================");
        console.log("SEEDING COMPLETED!");
        console.log("Demo Accounts:");
        console.log("  Admin:   admin@college.edu / admin123");
        console.log("  Staff 1: staff1@college.edu / staff123");
        console.log("  Staff 2: staff2@college.edu / staff123");
        console.log("  Student: student1@college.edu / student123");
        console.log("==========================================\n");

        process.exit(0);
    } catch (err) {
        console.error("Seeding Error:", err);
        process.exit(1);
    }
};

seedData();
