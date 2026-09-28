import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ComplaintDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        fetch(`http://localhost:5000/api/complaints/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setComplaint(data.complaint);
                } else {
                    alert(data.message);
                    navigate("/student/complaints");
                }

                setLoading(false);
            })
            .catch((error) => {
                console.error("Complaint Details Error:", error);
                alert("Unable to load complaint details");
                setLoading(false);
            });
    }, [id, navigate]);

    // Status badge color
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

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <h4>Loading complaint details...</h4>
            </div>
        );
    }

    if (!complaint) {
        return (
            <div className="container mt-5 text-center">
                <div className="alert alert-danger">
                    Complaint not found.
                </div>

                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/student/complaints")}
                >
                    Back to My Complaints
                </button>
            </div>
        );
    }

    return (
        <div className="bg-light min-vh-100">

            {/* NAVBAR */}
            <nav className="navbar navbar-dark bg-primary">
                <div className="container">

                    <span className="navbar-brand fw-bold">
                        College Complaint Management System
                    </span>

                    <button
                        className="btn btn-light"
                        onClick={() => navigate("/student/dashboard")}
                    >
                        Dashboard
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
                        onClick={() => navigate("/student/complaints")}
                    >
                        ← Back
                    </button>

                </div>


                <div className="card shadow">

                    <div className="card-body p-4">

                        {/* HEADER */}
                        <div className="d-flex justify-content-between align-items-center">

                            <h4 className="fw-bold">
                                {complaint.subject}
                            </h4>

                            <span
                                className={`badge ${getStatusClass(
                                    complaint.status
                                )}`}
                            >
                                {complaint.status}
                            </span>

                        </div>

                        <hr />


                        {/* COMPLAINT INFORMATION */}

                        <div className="row">

                            <div className="col-md-6 mb-3">

                                <strong>
                                    Complaint ID
                                </strong>

                                <p className="text-muted">
                                    {complaint.complaintId}
                                </p>

                            </div>


                            <div className="col-md-6 mb-3">

                                <strong>
                                    Category
                                </strong>

                                <p className="text-muted">
                                    {complaint.category?.name}
                                </p>

                            </div>


                            <div className="col-md-6 mb-3">

                                <strong>
                                    Priority
                                </strong>

                                <p className="text-muted">
                                    {complaint.priority}
                                </p>

                            </div>


                            <div className="col-md-6 mb-3">

                                <strong>
                                    Status
                                </strong>

                                <p>
                                    <span
                                        className={`badge ${getStatusClass(
                                            complaint.status
                                        )}`}
                                    >
                                        {complaint.status}
                                    </span>
                                </p>

                            </div>


                            <div className="col-md-6 mb-3">

                                <strong>
                                    Submitted Date
                                </strong>

                                <p className="text-muted">
                                    {new Date(
                                        complaint.createdAt
                                    ).toLocaleString()}
                                </p>

                            </div>


                            <div className="col-md-6 mb-3">

                                <strong>
                                    Last Updated
                                </strong>

                                <p className="text-muted">
                                    {new Date(
                                        complaint.updatedAt
                                    ).toLocaleString()}
                                </p>

                            </div>

                        </div>


                        <hr />


                        {/* DESCRIPTION */}

                        <h5 className="fw-bold">
                            Complaint Description
                        </h5>

                        <div className="bg-light p-3 rounded mt-2">
                            {complaint.description}
                        </div>


                        {/* DEPARTMENT */}

                        {complaint.department && (
                            <div className="mt-4">

                                <strong>
                                    Department
                                </strong>

                                <p className="text-muted">
                                    {complaint.department}
                                </p>

                            </div>
                        )}


                        {/* BACK BUTTON */}

                        <div className="mt-4">

                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    navigate("/student/complaints")
                                }
                            >
                                Back to My Complaints
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ComplaintDetails;