import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const navigate = useNavigate();

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token || !user || user.role !== "admin") {
            navigate("/");
            return;
        }

        fetch("http://localhost:5000/api/complaints", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setComplaints(data.complaints);
                } else {
                    alert(data.message);
                }

                setLoading(false);
            })
            .catch((error) => {
                console.error("Admin Dashboard Error:", error);
                alert("Unable to load complaints");
                setLoading(false);
            });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };

    // Complaint counts
    const totalComplaints = complaints.length;

    const pendingComplaints = complaints.filter(
        (complaint) => complaint.status === "Pending"
    ).length;

    const assignedComplaints = complaints.filter(
        (complaint) => complaint.status === "Assigned"
    ).length;

    const inProgressComplaints = complaints.filter(
        (complaint) => complaint.status === "In Progress"
    ).length;

    const resolvedComplaints = complaints.filter(
        (complaint) => complaint.status === "Resolved"
    ).length;

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

    return (
        <div className="bg-light min-vh-100">

            {/* NAVBAR */}
            <nav className="navbar navbar-dark bg-dark">
                <div className="container">

                    <span className="navbar-brand fw-bold">
                        College Complaint Management System
                    </span>

                    <div className="d-flex align-items-center gap-3">

                        <span className="text-white">
                            Admin
                        </span>

                        <button
                            className="btn btn-light"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </div>

                </div>
            </nav>


            {/* CONTENT */}
            <div className="container mt-4">

                <h2 className="fw-bold">
                    Admin Dashboard
                </h2>

                <p className="text-muted">
                    Manage and monitor student complaints
                </p>


                {/* STATISTICS */}

                <div className="row mt-4">

                    {/* TOTAL */}
                    <div className="col-md mb-3">

                        <div className="card shadow-sm border-0">

                            <div className="card-body">

                                <h6 className="text-muted">
                                    Total Complaints
                                </h6>

                                <h2 className="fw-bold">
                                    {totalComplaints}
                                </h2>

                            </div>

                        </div>

                    </div>


                    {/* PENDING */}
                    <div className="col-md mb-3">

                        <div className="card shadow-sm border-0">

                            <div className="card-body">

                                <h6 className="text-muted">
                                    Pending
                                </h6>

                                <h2 className="fw-bold text-warning">
                                    {pendingComplaints}
                                </h2>

                            </div>

                        </div>

                    </div>


                    {/* ASSIGNED */}
                    <div className="col-md mb-3">

                        <div className="card shadow-sm border-0">

                            <div className="card-body">

                                <h6 className="text-muted">
                                    Assigned
                                </h6>

                                <h2 className="fw-bold text-info">
                                    {assignedComplaints}
                                </h2>

                            </div>

                        </div>

                    </div>


                    {/* IN PROGRESS */}
                    <div className="col-md mb-3">

                        <div className="card shadow-sm border-0">

                            <div className="card-body">

                                <h6 className="text-muted">
                                    In Progress
                                </h6>

                                <h2 className="fw-bold text-primary">
                                    {inProgressComplaints}
                                </h2>

                            </div>

                        </div>

                    </div>


                    {/* RESOLVED */}
                    <div className="col-md mb-3">

                        <div className="card shadow-sm border-0">

                            <div className="card-body">

                                <h6 className="text-muted">
                                    Resolved
                                </h6>

                                <h2 className="fw-bold text-success">
                                    {resolvedComplaints}
                                </h2>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ALL COMPLAINTS */}

                <div className="card shadow-sm mt-4">

                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center mb-3">

                            <h4 className="fw-bold mb-0">
                                All Complaints
                            </h4>

                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    window.location.reload()
                                }
                            >
                                Refresh
                            </button>

                        </div>


                        {loading ? (

                            <div className="text-center py-4">
                                <p>Loading complaints...</p>
                            </div>

                        ) : complaints.length === 0 ? (

                            <div className="alert alert-info">
                                No complaints found.
                            </div>

                        ) : (

                            <div className="table-responsive">

                                <table className="table table-hover align-middle">

                                    <thead className="table-dark">

                                        <tr>

                                            <th>Complaint ID</th>

                                            <th>Student</th>

                                            <th>Category</th>

                                            <th>Subject</th>

                                            <th>Priority</th>

                                            <th>Status</th>

                                            <th>Date</th>

                                            <th>Action</th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {complaints.map((complaint) => (

                                            <tr key={complaint._id}>

                                                <td>
                                                    {complaint.complaintId}
                                                </td>

                                                <td>
                                                    <strong>
                                                        {complaint.student?.name}
                                                    </strong>

                                                    <br />

                                                    <small className="text-muted">
                                                        {complaint.student?.email}
                                                    </small>
                                                </td>

                                                <td>
                                                    {complaint.category?.name}
                                                </td>

                                                <td>
                                                    {complaint.subject}
                                                </td>

                                                <td>
                                                    {complaint.priority}
                                                </td>

                                                <td>

                                                    <span
                                                        className={`badge ${getStatusClass(
                                                            complaint.status
                                                        )}`}
                                                    >
                                                        {complaint.status}
                                                    </span>

                                                </td>

                                                <td>
                                                    {new Date(
                                                        complaint.createdAt
                                                    ).toLocaleDateString()}
                                                </td>

                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() =>
                                                            navigate(`/admin/complaint/${complaint._id}`)
                                                        }
                                                    >
                                                        View
                                                    </button>
                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AdminDashboard;