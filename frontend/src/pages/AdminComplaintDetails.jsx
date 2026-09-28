import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AdminComplaintDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState(null);
    const [status, setStatus] = useState("");

    // Staff states
    const [staff, setStaff] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState("");

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [loadingStaff, setLoadingStaff] = useState(true);

    // Get complaint and staff
    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token || !user || user.role !== "admin") {
            navigate("/");
            return;
        }

        // Fetch complaint
        fetch(`http://localhost:5000/api/complaints/admin/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setComplaint(data.complaint);
                    setStatus(data.complaint.status);
                } else {
                    alert(data.message);
                    navigate("/admin/dashboard");
                }

                setLoading(false);
            })
            .catch((error) => {
                console.error("Complaint Error:", error);
                alert("Unable to load complaint");
                setLoading(false);
            });

        // Fetch staff
        fetch("http://localhost:5000/api/staff", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setStaff(data.staff);
                } else {
                    alert(data.message);
                }

                setLoadingStaff(false);
            })
            .catch((error) => {
                console.error("Staff Error:", error);
                setLoadingStaff(false);
            });

    }, [id, navigate]);


    // Assign complaint to staff
    const handleAssignComplaint = async () => {
        const token = localStorage.getItem("token");

        if (!selectedStaff) {
            alert("Please select a staff member");
            return;
        }

        setAssigning(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/assignments",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        complaintId: id,
                        staffId: selectedStaff,
                        remarks: "Complaint assigned by admin"
                    })
                }
            );

            const data = await response.json();

            if (data.success) {
                alert("Complaint assigned successfully!");

                // Update complaint on screen
                setComplaint((prev) => ({
                    ...prev,
                    status: "Assigned"
                }));

                setStatus("Assigned");

            } else {
                alert(data.message);
            }

        } catch (error) {
            console.error("Assign Complaint Error:", error);
            alert("Unable to assign complaint");
        } finally {
            setAssigning(false);
        }
    };


    // Update complaint status
    const handleStatusUpdate = async () => {
        const token = localStorage.getItem("token");

        setUpdating(true);

        try {
            const response = await fetch(
                `http://localhost:5000/api/complaints/${id}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        status: status
                    })
                }
            );

            const data = await response.json();

            if (data.success) {
                alert("Complaint status updated successfully!");

                setComplaint(data.complaint);
                setStatus(data.complaint.status);
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.error("Status Update Error:", error);
            alert("Unable to update status");
        } finally {
            setUpdating(false);
        }
    };


    // Status badge class
    const getStatusClass = (status) => {
        switch (status) {
            case "Pending":
                return "bg-warning text-dark";

            case "Assigned":
                return "bg-info text-dark";

            case "In Progress":
                return "bg-primary";

            case "Resolved":
                return "bg-success";

            case "Closed":
                return "bg-dark";

            default:
                return "bg-secondary";
        }
    };


    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };


    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <h4>Loading complaint...</h4>
            </div>
        );
    }


    if (!complaint) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">
                    Complaint not found.
                </div>
            </div>
        );
    }


    return (
        <div className="bg-light min-vh-100">

            {/* NAVBAR */}

            <nav className="navbar navbar-dark bg-dark">

                <div className="container">

                    <span className="navbar-brand fw-bold">
                        College Complaint Management System
                    </span>

                    <button
                        className="btn btn-light"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </nav>


            {/* CONTENT */}

            <div className="container mt-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <h2 className="fw-bold">
                        Complaint Details
                    </h2>

                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate("/admin/dashboard")}
                    >
                        ← Back to Dashboard
                    </button>

                </div>


                <div className="card shadow">

                    <div className="card-body p-4">

                        {/* HEADER */}

                        <div className="d-flex justify-content-between align-items-center">

                            <div>

                                <h4 className="fw-bold">
                                    {complaint.subject}
                                </h4>

                                <p className="text-muted mb-0">
                                    {complaint.complaintId}
                                </p>

                            </div>

                            <span
                                className={`badge ${getStatusClass(
                                    complaint.status
                                )}`}
                            >
                                {complaint.status}
                            </span>

                        </div>


                        <hr />


                        {/* STUDENT */}

                        <h5 className="fw-bold">
                            Student Information
                        </h5>

                        <div className="row mb-4">

                            <div className="col-md-6">

                                <strong>Name</strong>

                                <p className="text-muted">
                                    {complaint.student?.name}
                                </p>

                            </div>

                            <div className="col-md-6">

                                <strong>Email</strong>

                                <p className="text-muted">
                                    {complaint.student?.email}
                                </p>

                            </div>

                        </div>


                        {/* COMPLAINT */}

                        <h5 className="fw-bold">
                            Complaint Information
                        </h5>

                        <div className="row">

                            <div className="col-md-6 mb-3">

                                <strong>Category</strong>

                                <p className="text-muted">
                                    {complaint.category?.name}
                                </p>

                            </div>


                            <div className="col-md-6 mb-3">

                                <strong>Priority</strong>

                                <p className="text-muted">
                                    {complaint.priority}
                                </p>

                            </div>


                            <div className="col-md-6 mb-3">

                                <strong>Submitted Date</strong>

                                <p className="text-muted">
                                    {new Date(
                                        complaint.createdAt
                                    ).toLocaleString()}
                                </p>

                            </div>


                            <div className="col-md-6 mb-3">

                                <strong>Last Updated</strong>

                                <p className="text-muted">
                                    {new Date(
                                        complaint.updatedAt
                                    ).toLocaleString()}
                                </p>

                            </div>

                        </div>


                        {/* DESCRIPTION */}

                        <h5 className="fw-bold mt-3">
                            Description
                        </h5>

                        <div className="bg-light p-3 rounded mb-4">
                            {complaint.description}
                        </div>


                        {/* STAFF ASSIGNMENT */}

                        <div className="card border-success mb-4">

                            <div className="card-body">

                                <h5 className="fw-bold">
                                    Assign Complaint to Staff
                                </h5>

                                <p className="text-muted">
                                    Select a staff member to handle this
                                    complaint.
                                </p>


                                <div className="row align-items-end">

                                    <div className="col-md-8">

                                        <label className="form-label">
                                            Select Staff
                                        </label>

                                        <select
                                            className="form-select"
                                            value={selectedStaff}
                                            onChange={(e) =>
                                                setSelectedStaff(
                                                    e.target.value
                                                )
                                            }
                                            disabled={
                                                loadingStaff || assigning
                                            }
                                        >

                                            <option value="">
                                                Select Staff
                                            </option>

                                            {loadingStaff ? (
                                                <option disabled>
                                                    Loading staff...
                                                </option>
                                            ) : staff.length === 0 ? (
                                                <option disabled>
                                                    No staff available
                                                </option>
                                            ) : (
                                                staff.map((member) => (
                                                    <option
                                                        key={member._id}
                                                        value={member._id}
                                                    >
                                                        {member.name} -{" "}
                                                        {member.email}
                                                    </option>
                                                ))
                                            )}

                                        </select>

                                    </div>


                                    <div className="col-md-4 mt-3 mt-md-0">

                                        <button
                                            className="btn btn-success w-100"
                                            onClick={handleAssignComplaint}
                                            disabled={
                                                !selectedStaff || assigning
                                            }
                                        >
                                            {assigning
                                                ? "Assigning..."
                                                : "Assign Complaint"}
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* STATUS UPDATE */}

                        <div className="card border-primary">

                            <div className="card-body">

                                <h5 className="fw-bold">
                                    Update Complaint Status
                                </h5>

                                <div className="row align-items-end">

                                    <div className="col-md-8">

                                        <label className="form-label">
                                            Select Status
                                        </label>

                                        <select
                                            className="form-select"
                                            value={status}
                                            onChange={(e) =>
                                                setStatus(e.target.value)
                                            }
                                        >

                                            <option value="Pending">
                                                Pending
                                            </option>

                                            <option value="Assigned">
                                                Assigned
                                            </option>

                                            <option value="In Progress">
                                                In Progress
                                            </option>

                                            <option value="Resolved">
                                                Resolved
                                            </option>

                                            <option value="Closed">
                                                Closed
                                            </option>

                                        </select>

                                    </div>


                                    <div className="col-md-4 mt-3 mt-md-0">

                                        <button
                                            className="btn btn-primary w-100"
                                            onClick={handleStatusUpdate}
                                            disabled={updating}
                                        >
                                            {updating
                                                ? "Updating..."
                                                : "Update Status"}
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AdminComplaintDetails;