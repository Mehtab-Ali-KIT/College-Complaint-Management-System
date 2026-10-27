import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { StatusBadge, PriorityBadge } from "../../components/StatusBadge";
import { Toast } from "../../components/Toast";
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    CheckCircle2,
    Clock,
    UserCheck,
    Wrench,
    FileText,
    CheckSquare,
    Save,
    Star
} from "lucide-react";

function StaffComplaintDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState(null);
    const [assignment, setAssignment] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [status, setStatus] = useState("");
    const [resolutionNotes, setResolutionNotes] = useState("");

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchComplaint = async () => {
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
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (data.success) {
                setComplaint(data.complaint);
                setAssignment(data.assignment);
                setFeedback(data.feedback);
                setStatus(data.complaint.status);
                setResolutionNotes(data.complaint.resolutionNotes || "");
            } else {
                showToast("error", data.message || "Complaint not found.");
            }
        } catch (error) {
            console.error("FETCH COMPLAINT ERROR:", error);
            showToast("error", "Server connection error.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaint();
    }, [id]);

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        setUpdating(true);
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:5000/api/complaints/${id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    status,
                    resolutionNotes
                })
            });

            const data = await response.json();

            if (data.success) {
                showToast("success", "Complaint updated successfully!");
                fetchComplaint();
            } else {
                showToast("error", data.message || "Failed to update complaint.");
            }
        } catch (error) {
            console.error("Update error:", error);
            showToast("error", "Server connection error");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-vh-100" style={{ backgroundColor: "#f8fafc" }}>
                <Navbar activeTab="staff-assigned" />
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="text-muted small mt-2">Loading task details...</p>
                </div>
            </div>
        );
    }

    if (!complaint) {
        return (
            <div className="min-vh-100" style={{ backgroundColor: "#f8fafc" }}>
                <Navbar activeTab="staff-assigned" />
                <div className="container mt-5 text-center">
                    <div className="custom-card p-5">
                        <FileText size={48} className="text-muted mb-3" />
                        <h4>Task Not Found</h4>
                        <Link to="/staff/dashboard" className="btn btn-primary-custom mt-3">
                            Back to Staff Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const isResolved = complaint.status === "Resolved" || complaint.status === "Closed";

    return (
        <div className="min-vh-100 pb-5" style={{ backgroundColor: "#f8fafc" }}>
            <Navbar activeTab="staff-assigned" />
            <Toast toast={toast} onClose={() => setToast(null)} />

            <div className="container px-4 mt-4 max-w-7xl mx-auto" style={{ maxWidth: "1100px" }}>
                <Link to="/staff/dashboard" className="btn btn-sm btn-outline-custom mb-3">
                    <ArrowLeft size={16} /> Back to Staff Dashboard
                </Link>

                {/* Complaint Header */}
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
                            <span className="d-block text-uppercase fw-semibold text-secondary" style={{ fontSize: "0.7rem" }}>Assigned Remarks</span>
                            <span className="fw-semibold text-dark fs-6">{assignment?.remarks || "None"}</span>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Left Column: Complaint Details & Timeline */}
                    <div className="col-lg-7">
                        {/* Description */}
                        <div className="custom-card p-4 mb-4">
                            <h5 className="fw-bold text-dark mb-3">Full Complaint Description</h5>
                            <div className="p-3 bg-light rounded-3 border text-dark lead fs-6 lh-base">
                                {complaint.description}
                            </div>
                        </div>

                        {/* Progress Timeline */}
                        <div className="custom-card p-4 mb-4">
                            <h5 className="fw-bold text-dark mb-3">Resolution Workflow Progress</h5>
                            <div className="timeline">
                                <div className="timeline-item">
                                    <div className="timeline-dot completed">
                                        <CheckCircle2 size={12} />
                                    </div>
                                    <div className="fw-bold text-dark">Complaint Filed</div>
                                    <div className="text-muted small">{new Date(complaint.createdAt).toLocaleString()}</div>
                                </div>

                                <div className="timeline-item">
                                    <div className={`timeline-dot ${assignment ? "completed" : ""}`}>
                                        <UserCheck size={12} />
                                    </div>
                                    <div className="fw-bold text-dark">Assigned to You</div>
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
                                        {isResolved ? "Work Completed & Resolved" : "Under Action"}
                                    </div>
                                    {complaint.resolutionNotes && (
                                        <div className="p-2.5 bg-success-subtle text-success-emphasis rounded-3 border border-success-subtle small mt-1">
                                            <strong>Resolution Note:</strong> {complaint.resolutionNotes}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Student Feedback if resolved */}
                        {feedback && (
                            <div className="custom-card p-4 mb-4 border-success">
                                <h5 className="fw-bold text-success mb-2 d-flex align-items-center gap-1.5">
                                    <Star size={18} fill="#10b981" /> Student Rating
                                </h5>
                                <div className="d-flex align-items-center gap-1 mb-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star
                                            key={star}
                                            size={18}
                                            fill={star <= feedback.rating ? "#f59e0b" : "none"}
                                            color={star <= feedback.rating ? "#f59e0b" : "#cbd5e1"}
                                        />
                                    ))}
                                    <span className="fw-bold text-dark ms-2">{feedback.rating} / 5</span>
                                </div>
                                <p className="text-muted small mb-0">"{feedback.comment || "No comment."}"</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Status Editor & Student Profile */}
                    <div className="col-lg-5">
                        {/* Status Editor Form */}
                        <div className="custom-card p-4 mb-4 border-primary">
                            <h5 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                                <Wrench size={18} className="text-primary" /> Update Work Status
                            </h5>
                            <p className="text-muted small mb-3">Change task state or document repair steps.</p>

                            <form onSubmit={handleUpdateStatus}>
                                <div className="mb-3">
                                    <label className="form-label small fw-semibold text-secondary">Task Status</label>
                                    <select
                                        className="form-select-custom"
                                        value={status}
                                        onChange={e => setStatus(e.target.value)}
                                    >
                                        <option value="Assigned">Assigned (Received)</option>
                                        <option value="In Progress">In Progress (Work Underway)</option>
                                        <option value="Resolved">Resolved (Fixed)</option>
                                        <option value="Closed">Closed (Archived)</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-semibold text-secondary">Resolution Notes / Log</label>
                                    <textarea
                                        className="form-control-custom"
                                        rows="4"
                                        placeholder="Enter details about replaced hardware, technician findings, or inspection results..."
                                        value={resolutionNotes}
                                        onChange={e => setResolutionNotes(e.target.value)}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary-custom w-100 justify-content-center py-2.5"
                                    disabled={updating}
                                >
                                    {updating ? "Saving Update..." : (
                                        <>
                                            <Save size={16} /> Save Status Update
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Student Profile Card */}
                        <div className="custom-card p-4">
                            <h6 className="fw-bold text-dark mb-3">Student Contact Details</h6>
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div className="brand-icon-box" style={{ width: "42px", height: "42px", borderRadius: "50%" }}>
                                    <User size={20} />
                                </div>
                                <div>
                                    <div className="fw-bold text-dark">{complaint.student?.name || "Student"}</div>
                                    <span className="badge bg-primary-light text-primary" style={{ fontSize: "0.7rem" }}>
                                        Complainant
                                    </span>
                                </div>
                            </div>
                            <div className="d-flex flex-column gap-2 text-muted small">
                                <div className="d-flex align-items-center gap-2">
                                    <Mail size={15} className="text-primary" />
                                    <span>{complaint.student?.email || "N/A"}</span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <Phone size={15} className="text-success" />
                                    <span>{complaint.student?.phone || "No phone updated"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StaffComplaintDetails;