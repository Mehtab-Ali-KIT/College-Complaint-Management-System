import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { StatusBadge, PriorityBadge } from "../components/StatusBadge";
import { Toast } from "../components/Toast";
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    UserCheck,
    Wrench,
    FileText,
    Star,
    Send,
    MessageSquare,
    User,
    Mail,
    Phone
} from "lucide-react";

function ComplaintDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState(null);
    const [assignment, setAssignment] = useState(null);
    const [feedback, setFeedback] = useState(null);

    // Student rating state
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submittingFeedback, setSubmittingFeedback] = useState(false);

    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/");
                return;
            }

            const response = await fetch(`http://localhost:5000/api/complaints/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setComplaint(data.complaint);
                setAssignment(data.assignment);
                setFeedback(data.feedback);
                if (data.feedback) {
                    setRating(data.feedback.rating || 5);
                    setComment(data.feedback.comment || "");
                }
            } else {
                showToast("error", data.message || "Complaint not found.");
            }
        } catch (error) {
            console.error("Complaint Details Error:", error);
            showToast("error", "Unable to load complaint details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        setSubmittingFeedback(true);
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:5000/api/complaints/${id}/feedback`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ rating, comment })
            });

            const data = await response.json();

            if (data.success) {
                showToast("success", "Thank you! Your feedback has been submitted.");
                setFeedback(data.feedback);
            } else {
                showToast("error", data.message || "Failed to submit feedback.");
            }
        } catch (error) {
            console.error("Feedback submit error:", error);
            showToast("error", "Server connection error");
        } finally {
            setSubmittingFeedback(false);
        }
    };

    if (loading) {
        return (
            <div className="min-vh-100" style={{ backgroundColor: "#f8fafc" }}>
                <Navbar activeTab="my-complaints" />
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="text-muted small mt-2">Loading complaint details...</p>
                </div>
            </div>
        );
    }

    if (!complaint) {
        return (
            <div className="min-vh-100" style={{ backgroundColor: "#f8fafc" }}>
                <Navbar activeTab="my-complaints" />
                <div className="container mt-5 text-center">
                    <div className="custom-card p-5">
                        <FileText size={48} className="text-muted mb-3" />
                        <h4>Complaint Not Found</h4>
                        <Link to="/student/complaints" className="btn btn-primary-custom mt-3">
                            Back to My Complaints
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const isResolved = complaint.status === "Resolved" || complaint.status === "Closed";

    return (
        <div className="min-vh-100 pb-5" style={{ backgroundColor: "#f8fafc" }}>
            <Navbar activeTab="my-complaints" />
            <Toast toast={toast} onClose={() => setToast(null)} />

            <div className="container px-4 mt-4 max-w-7xl mx-auto" style={{ maxWidth: "1000px" }}>
                <Link to="/student/complaints" className="btn btn-sm btn-outline-custom mb-3">
                    <ArrowLeft size={16} /> Back to My Complaints
                </Link>

                {/* Complaint Header Card */}
                <div className="custom-card p-4 mb-4">
                    <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 border-bottom pb-3 mb-3">
                        <div>
                            <div className="d-flex align-items-center gap-2 mb-1">
                                <span className="fw-bold text-primary">{complaint.complaintId}</span>
                                <PriorityBadge priority={complaint.priority} />
                            </div>
                            <h3 className="fw-bold text-dark mb-0">{complaint.subject}</h3>
                        </div>
                        <div>
                            <StatusBadge status={complaint.status} />
                        </div>
                    </div>

                    <div className="row g-3 text-muted small">
                        <div className="col-sm-4">
                            <span className="d-block text-uppercase fw-semibold text-secondary" style={{ fontSize: "0.7rem" }}>Category</span>
                            <span className="fw-semibold text-dark fs-6">{complaint.category?.name || "General"}</span>
                        </div>
                        <div className="col-sm-4">
                            <span className="d-block text-uppercase fw-semibold text-secondary" style={{ fontSize: "0.7rem" }}>Submitted Date</span>
                            <span className="fw-semibold text-dark fs-6">{new Date(complaint.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="col-sm-4">
                            <span className="d-block text-uppercase fw-semibold text-secondary" style={{ fontSize: "0.7rem" }}>Last Update</span>
                            <span className="fw-semibold text-dark fs-6">{new Date(complaint.updatedAt).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Left Side: Description & Progress Timeline */}
                    <div className="col-lg-7">
                        <div className="custom-card p-4 mb-4">
                            <h5 className="fw-bold text-dark mb-3">Submitted Description</h5>
                            <div className="p-3 bg-light rounded-3 border text-dark lead fs-6 lh-base">
                                {complaint.description}
                            </div>
                        </div>

                        {/* Progress Timeline */}
                        <div className="custom-card p-4 mb-4">
                            <h5 className="fw-bold text-dark mb-3">Live Status Progress</h5>
                            <div className="timeline">
                                <div className="timeline-item">
                                    <div className="timeline-dot completed">
                                        <CheckCircle2 size={12} />
                                    </div>
                                    <div className="fw-bold text-dark">Submitted</div>
                                    <div className="text-muted small">{new Date(complaint.createdAt).toLocaleString()}</div>
                                </div>

                                <div className="timeline-item">
                                    <div className={`timeline-dot ${assignment ? "completed" : ""}`}>
                                        <UserCheck size={12} />
                                    </div>
                                    <div className="fw-bold text-dark">
                                        {assignment ? `Assigned to Staff (${assignment.assignedTo?.name})` : "Awaiting Staff Assignment"}
                                    </div>
                                    {assignment && (
                                        <div className="text-muted small">
                                            Assigned On: {new Date(assignment.assignedAt).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>

                                <div className="timeline-item">
                                    <div className={`timeline-dot ${isResolved ? "completed" : ""}`}>
                                        <Wrench size={12} />
                                    </div>
                                    <div className="fw-bold text-dark">
                                        {isResolved ? "Issue Resolved" : `Current Status: ${complaint.status}`}
                                    </div>
                                    {complaint.resolutionNotes && (
                                        <div className="p-3 bg-success-subtle text-success-emphasis rounded-3 border border-success-subtle small mt-2">
                                            <div className="fw-bold mb-1">Official Resolution Note:</div>
                                            <div>{complaint.resolutionNotes}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Assigned Staff & Feedback Form */}
                    <div className="col-lg-5">
                        {/* Assigned Staff Card */}
                        {assignment?.assignedTo && (
                            <div className="custom-card p-4 mb-4">
                                <h6 className="fw-bold text-dark mb-3">Assigned Staff Supervisor</h6>
                                <div className="d-flex align-items-center gap-3 mb-2">
                                    <div className="brand-icon-box" style={{ width: "42px", height: "42px", borderRadius: "50%" }}>
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <div className="fw-bold text-dark">{assignment.assignedTo.name}</div>
                                        <span className="badge bg-primary-light text-primary" style={{ fontSize: "0.7rem" }}>
                                            Assigned Staff
                                        </span>
                                    </div>
                                </div>
                                <div className="d-flex flex-column gap-1.5 text-muted small mt-2">
                                    <div className="d-flex align-items-center gap-2">
                                        <Mail size={14} className="text-primary" />
                                        <span>{assignment.assignedTo.email}</span>
                                    </div>
                                    {assignment.assignedTo.phone && (
                                        <div className="d-flex align-items-center gap-2">
                                            <Phone size={14} className="text-success" />
                                            <span>{assignment.assignedTo.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Interactive Student 5-Star Feedback Widget (when resolved) */}
                        {isResolved ? (
                            <div className="custom-card p-4 border-success">
                                <h5 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                                    <Star size={18} className="text-warning" fill="#f59e0b" /> Rate Resolution Experience
                                </h5>
                                <p className="text-muted small mb-3">Help us improve campus services by leaving feedback.</p>

                                <form onSubmit={handleFeedbackSubmit}>
                                    <div className="mb-3 text-center p-3 bg-light rounded-3 border">
                                        <div className="d-flex justify-content-center gap-2 mb-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={28}
                                                    style={{ cursor: "pointer", transition: "transform 0.15s ease" }}
                                                    fill={(hoverRating || rating) >= star ? "#f59e0b" : "none"}
                                                    color={(hoverRating || rating) >= star ? "#f59e0b" : "#94a3b8"}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => setRating(star)}
                                                />
                                            ))}
                                        </div>
                                        <span className="fw-bold text-dark small">
                                            {rating === 5 ? "Excellent 🌟" : rating === 4 ? "Good 👍" : rating === 3 ? "Average 😐" : "Poor 👎"}
                                        </span>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold text-secondary">Comments / Feedback</label>
                                        <textarea
                                            className="form-control-custom"
                                            rows="3"
                                            placeholder="Write your comments regarding the speed and quality of resolution..."
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary-custom w-100 justify-content-center py-2.5"
                                        disabled={submittingFeedback}
                                    >
                                        {submittingFeedback ? (
                                            "Submitting..."
                                        ) : (
                                            <>
                                                <Send size={16} /> {feedback ? "Update Feedback" : "Submit Feedback"}
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="p-4 rounded-4 bg-light border text-center">
                                <Clock size={32} className="text-warning mb-2" />
                                <h6 className="fw-bold text-dark mb-1">Under Resolution Process</h6>
                                <p className="text-muted small mb-0">
                                    Once campus staff marks this issue as resolved, you will be able to submit a rating and feedback here.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ComplaintDetails;