import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function StaffComplaintDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchComplaint();
    }, []);

    const fetchComplaint = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/complaints/${id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (data.success) {
                setComplaint(data.complaint);
            } else {
                setError(data.message || "Complaint not found.");
            }

        } catch (error) {

            console.error("FETCH COMPLAINT ERROR:", error);

            setError("Server error.");

        } finally {

            setLoading(false);

        }
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <h4>Loading complaint...</h4>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">
                    {error}
                </div>

                <button
                    className="btn btn-secondary"
                    onClick={() => navigate("/staff/dashboard")}
                >
                    Back
                </button>
            </div>
        );
    }

    return (
        <div className="container mt-4">

            <button
                className="btn btn-secondary mb-3"
                onClick={() => navigate("/staff/dashboard")}
            >
                ← Back to Dashboard
            </button>

            <div className="card shadow">

                <div className="card-header">
                    <h4>Complaint Details</h4>
                </div>

                <div className="card-body">

                    <p>
                        <strong>Complaint ID:</strong>{" "}
                        {complaint.complaintId}
                    </p>

                    <p>
                        <strong>Subject:</strong>{" "}
                        {complaint.subject}
                    </p>

                    <p>
                        <strong>Description:</strong>{" "}
                        {complaint.description}
                    </p>

                    <p>
                        <strong>Priority:</strong>{" "}
                        {complaint.priority}
                    </p>

                    <p>
                        <strong>Status:</strong>{" "}
                        {complaint.status}
                    </p>

                    <p>
                        <strong>Created At:</strong>{" "}
                        {new Date(
                            complaint.createdAt
                        ).toLocaleString()}
                    </p>

                </div>

            </div>

        </div>
    );
}

export default StaffComplaintDetails;