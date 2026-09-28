import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        fetch("http://localhost:5000/api/complaints/my", {
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
                console.error("Error:", error);
                alert("Unable to load complaints");
                setLoading(false);
            });
    }, [navigate]);

    return (
        <div className="bg-light min-vh-100">

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

            <div className="container mt-4">

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold">My Complaints</h2>

                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/student/complaint")}
                    >
                        + New Complaint
                    </button>
                </div>

                {loading ? (
                    <div className="text-center">
                        <p>Loading complaints...</p>
                    </div>
                ) : complaints.length === 0 ? (
                    <div className="alert alert-info">
                        You have not submitted any complaints yet.
                    </div>
                ) : (
                    <div className="row">

                        {complaints.map((complaint) => (
                            <div
                                className="col-md-6 mb-4"
                                key={complaint._id}
                            >
                                <div className="card shadow-sm h-100">

                                    <div className="card-body">

                                        <div className="d-flex justify-content-between">
                                            <h5 className="fw-bold">
                                                {complaint.subject}
                                            </h5>

                                            <span className="badge bg-warning text-dark">
                                                {complaint.status}
                                            </span>
                                        </div>

                                        <hr />

                                        <p>
                                            <strong>Complaint ID:</strong>{" "}
                                            {complaint.complaintId}
                                        </p>

                                        <p>
                                            <strong>Category:</strong>{" "}
                                            {complaint.category?.name}
                                        </p>

                                        <p>
                                            <strong>Priority:</strong>{" "}
                                            {complaint.priority}
                                        </p>

                                        <p>
                                            <strong>Description:</strong>{" "}
                                            {complaint.description}
                                        </p>

                                        <p className="text-muted mb-0">
                                            Submitted:{" "}
                                            {new Date(
                                                complaint.createdAt
                                            ).toLocaleDateString()}
                                        </p>

                                        <button
                                            className="btn btn-primary mt-3"
                                            onClick={() =>
                                                navigate(`/student/complaint/${complaint._id}`)
                                            }
                                        >
                                            View Details
                                        </button>

                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                )}

            </div>
        </div>
    );
}

export default MyComplaints;