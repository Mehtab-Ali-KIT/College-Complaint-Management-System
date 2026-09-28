import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StaffDashboard() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const token = localStorage.getItem("token");

            // Token check
            if (!token) {
                setError("Please login first.");
                setLoading(false);
                return;
            }

            // Correct API endpoint
            const response = await fetch(
                "http://localhost:5000/api/assignments/my",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            console.log("STAFF ASSIGNMENTS:", data);

            if (data.success) {
                setAssignments(data.assignments || []);
            } else {
                setError(
                    data.message || "Failed to load assigned complaints."
                );
            }
        } catch (error) {
            console.error("FETCH ASSIGNMENTS ERROR:", error);
            setError(error.message || "Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Loading
    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>

                <h5 className="mt-3">
                    Loading assigned complaints...
                </h5>
            </div>
        );
    }

    return (
        <div className="container mt-4">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">Staff Dashboard</h2>
                    <p className="text-muted mb-0">
                        Manage your assigned complaints
                    </p>
                </div>

                <button
                    className="btn btn-outline-danger"
                    onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        navigate("/");
                    }}
                >
                    Logout
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="alert alert-danger">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* No complaints */}
            {!error && assignments.length === 0 && (
                <div className="alert alert-info">
                    <h5>No complaints assigned</h5>
                    <p className="mb-0">
                        Currently, there are no complaints assigned to you.
                    </p>
                </div>
            )}

            {/* Assignment Table */}
            {assignments.length > 0 && (
                <div className="card shadow">

                    <div className="card-header bg-primary text-white">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">
                                Assigned Complaints
                            </h5>

                            <span className="badge bg-light text-dark">
                                Total: {assignments.length}
                            </span>
                        </div>
                    </div>

                    <div className="card-body">

                        <div className="table-responsive">

                            <table className="table table-bordered table-hover align-middle">

                                <thead className="table-dark">
                                    <tr>
                                        <th>#</th>
                                        <th>Complaint ID</th>
                                        <th>Subject</th>
                                        <th>Priority</th>
                                        <th>Status</th>
                                        <th>Assigned At</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {assignments.map((assignment, index) => {

                                        const complaint =
                                            assignment.complaint;

                                        return (
                                            <tr key={assignment._id}>

                                                {/* Number */}
                                                <td>
                                                    {index + 1}
                                                </td>

                                                {/* Complaint ID */}
                                                <td>
                                                    <strong>
                                                        {complaint?.complaintId ||
                                                            "N/A"}
                                                    </strong>
                                                </td>

                                                {/* Subject */}
                                                <td>
                                                    {complaint?.subject ||
                                                        "No subject"}
                                                </td>

                                                {/* Priority */}
                                                <td>
                                                    <span
                                                        className={`badge ${
                                                            complaint?.priority ===
                                                            "High"
                                                                ? "bg-danger"
                                                                : complaint?.priority ===
                                                                  "Low"
                                                                ? "bg-success"
                                                                : "bg-warning text-dark"
                                                        }`}
                                                    >
                                                        {complaint?.priority ||
                                                            "Medium"}
                                                    </span>
                                                </td>

                                                {/* Status */}
                                                <td>
                                                    <span
                                                        className={`badge ${
                                                            complaint?.status ===
                                                            "Resolved"
                                                                ? "bg-success"
                                                                : complaint?.status ===
                                                                  "In Progress"
                                                                ? "bg-info text-dark"
                                                                : complaint?.status ===
                                                                  "Closed"
                                                                ? "bg-dark"
                                                                : "bg-primary"
                                                        }`}
                                                    >
                                                        {complaint?.status ||
                                                            "Assigned"}
                                                    </span>
                                                </td>

                                                {/* Assigned At */}
                                                <td>
                                                    {assignment.assignedAt
                                                        ? new Date(
                                                              assignment.assignedAt
                                                          ).toLocaleString()
                                                        : "N/A"}
                                                </td>

                                                {/* Action */}
                                                <td>
                                                    {complaint?._id ? (
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/staff/complaint/${complaint._id}`
                                                                )
                                                            }
                                                        >
                                                            View Details
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn btn-sm btn-secondary"
                                                            disabled
                                                        >
                                                            Not Available
                                                        </button>
                                                    )}
                                                </td>

                                            </tr>
                                        );
                                    })}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default StaffDashboard;