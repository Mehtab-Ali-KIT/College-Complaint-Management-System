import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { StatusBadge, PriorityBadge } from "../components/StatusBadge";
import { Toast } from "../components/Toast";
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Calendar,
    Clock,
    UserCheck,
    CheckCircle2,
    MessageSquare,
    Send,
    Star,
    Layers,
    Shield,
    FileText,
    CheckSquare
} from "lucide-react";

function AdminComplaintDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState(null);
    const [assignment, setAssignment] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [staffList, setStaffList] = useState([]);

    const [status, setStatus] = useState("");
    const [resolutionNotes, setResolutionNotes] = useState("");
    const [selectedStaff, setSelectedStaff] = useState("");
    const [assignRemarks, setAssignRemarks] = useState("");

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchDetails = () => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (!token || user.role !== "admin") {
            navigate("/");
            return;
        }

        Promise.all([
            fetch(`http://localhost:5000/api/complaints/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => res.json()),
            fetch("http://localhost:5000/api/staff", {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => res.json())
        ])
            .then(([compData, staffData]) => {
                if (compData.success) {
                    setComplaint(compData.complaint);
                    setAssignment(compData.assignment);
                    setFeedback(compData.feedback);
                    setStatus(compData.complaint.status);
                    setResolutionNotes(compData.complaint.resolutionNotes || "");
                    if (compData.assignment?.assignedTo?._id) {
                        setSelectedStaff(compData.assignment.assignedTo._id);
                    }
                } else {
                    showToast("error", compData.message || "Complaint not found.");
                }

                if (staffData.success) {
                    setStaffList(staffData.staff || []);
                }

                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch detail error:", err);
                showToast("error", "Unable to load complaint details");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const handleAssignComplaint = async () => {
        if (!selectedStaff) {
            showToast("error", "Please select a staff member");
            return;
        }

        setAssigning(true);
        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:5000/api/assignments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    complaintId: id,
                    staffId: selectedStaff,
                    remarks: assignRemarks || "Assigned by Administrator"
                })
            });

            const data = await response.json();

            if (data.success) {
                showToast("success", "Complaint assigned successfully!");
                fetchDetails();
            } else {
                showToast("error", data.message || "Failed to assign complaint.");
            }
        } catch (error) {
            console.error("Assign error:", error);
            showToast("error", "Server connection error");
        } finally {
            setAssigning(false);
        }
    };

    const handleStatusUpdate = async () => {
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
                showToast("success", "Complaint status updated successfully!");
                fetchDetails();
            } else {
                showToast("error", data.message || "Failed to update status.");
            }
        } catch (error) {
            console.error("Update status error:", error);
            showToast("error", "Server connection error");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-vh-100" style={{ backgroundColor: "#f8fafc" }}>
                <Navbar activeTab="admin-dashboard" />
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
                <Navbar activeTab="admin-dashboard" />
                <div className="container mt-5 text-center">
                    <div className="custom-card p-5">
                        <FileText size={48} className="text-muted mb-3" />
                        <h4>Complaint Not Found</h4>
                        <Link to="/admin/dashboard" className="btn btn-primary-custom mt-3">
                            Back to Admin Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const isResolved = complaint.status === "Resolved" || complaint.status === "Closed";

    return (
        <div className="min-vh-100 pb-5" style={{ backgroundColor: "#f8fafc" }}>
            <Navbar activeTab="admin-dashboard" />
            <Toast toast={toast} onClose={() => setToast(null)} />

            <div className="container px-4 mt-4 max-w-7xl mx-auto" style={{ maxWidth: "1100px" }}>
                {/* Back Button */}
                <Link to="/admin/dashboard" className="btn btn-sm btn-outline-custom mb-3">
                    <ArrowLeft size={16} /> Back to Dashboard
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
                            <span className="d-block text-uppercase fw-semibold text-secondary" style={{ fontSize: "0.7rem" }}>Submitted On</span>
                            <span className="fw-semibold text-dark fs-6">{new Date(complaint.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="col-sm-4">
                            <span className="d-block text-uppercase fw-semibold text-secondary" style={{ fontSize: "0.7rem" }}>Last Update</span>
                            <span className="fw-semibold text-dark fs-6">{new Date(complaint.updatedAt).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Left Column: Complaint Body & Timeline */}
                    <div className="col-lg-7">
                        {/* Description */}
                        <div className="custom-card p-4 mb-4">
                            <h5 className="fw-bold text-dark mb-3">Issue Description</h5>
                            <div className="p-3 bg-light rounded-3 border text-dark lead fs-6 lh-base mb-3">
                                {complaint.description}
                            </div>
                        </div>

                        {/* Lifecycle Progress Timeline */}
                        <div className="custom-card p-4 mb-4">
                            <h5 className="fw-bold text-dark mb-3">Resolution Progress Timeline</h5>
                            <div className="timeline">
                                {/* Step 1: Created */}
                                <div className="timeline-item">
                                    <div className="timeline-dot completed">
                                        <CheckCircle2 size={12} />
                                    </div>
                                    <div className="fw-bold text-dark">Complaint Submitted</div>
                                    <div className="text-muted small">
                                        {new Date(complaint.createdAt).toLocaleString()}
                                    </div>
                                </div>

                                {/* Step 2: Assigned */}
                                <div className="timeline-item">
                                    <div className={`timeline-dot ${assignment ? "completed" : ""}`}>
                                        <UserCheck size={12} />
                                    </div>
                                    <div className="fw-bold text-dark">
                                        {assignment ? `Assigned to ${assignment.assignedTo?.name}` : "Pending Staff Assignment"}
                                    </div>
                                    {assignment && (
                                        <div className="text-muted small">
                                            Remarks: {assignment.remarks || "Assigned by Admin"} • {new Date(assignment.assignedAt).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>

                                {/* Step 3: Resolution Status */}
                                <div className="timeline-item">
                                    <div className={`timeline-dot ${isResolved ? "completed" : ""}`}>
                                        <CheckSquare size={12} />
                                    </div>
                                    <div className="fw-bold text-dark">
                                        {isResolved ? `Resolved (${complaint.status})` : `Current Status: ${complaint.status}`}
                                    </div>
                                    {complaint.resolutionNotes && (
                                        <div className="p-2.5 bg-success-subtle text-success-emphasis rounded-3 border border-success-subtle small mt-1">
                                            <strong>Resolution Note:</strong> {complaint.resolutionNotes}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Student Feedback if available */}
                        {feedback && (
                            <div className="custom-card p-4 mb-4 border-success">
                                <h5 className="fw-bold text-success mb-2 d-flex align-items-center gap-1.5">
                                    <Star size={18} fill="#10b981" /> Student Feedback
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
                                    <span className="fw-bold text-dark ms-2">{feedback.rating} / 5 Stars</span>
                                </div>
                                <p className="text-muted small mb-0 font-italic">"{feedback.comment || "No comment left."}"</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Admin Actions & Student Profile */}
                    <div className="col-lg-5">
                        {/* Student Info Card */}
                        <div className="custom-card p-4 mb-4">
                            <h6 className="fw-bold text-dark mb-3">Student Information</h6>
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <div className="brand-icon-box" style={{ width: "42px", height: "42px", borderRadius: "50%" }}>
                                    <User size={20} />
                                </div>
                                <div>
                                    <div className="fw-bold text-dark">{complaint.student?.name || "Student Name"}</div>
                                    <span className="badge bg-primary-light text-primary" style={{ fontSize: "0.7rem" }}>
                                        Student Account
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
                                    <span>{complaint.student?.phone || "Phone not provided"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Staff Assignment Card */}
                        <div className="custom-card p-4 mb-4">
                            <h6 className="fw-bold text-dark mb-2">Assign Complaint to Staff</h6>
                            <p className="text-muted small mb-3">Delegate this issue to a designated staff supervisor.</p>

                            <div className="mb-3">
                                <label className="form-label small fw-semibold text-secondary">Select Staff Member</label>
                                <select
                                    className="form-select-custom"
                                    value={selectedStaff}
                                    onChange={e => setSelectedStaff(e.target.value)}
                                >
                                    <option value="">-- Choose Staff Member --</option>
                                    {staffList.map(s => (
                                        <option key={s._id} value={s._id}>
                                            {s.name} ({s.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-semibold text-secondary">Assignment Remarks</label>
                                <textarea
                                    className="form-control-custom"
                                    rows="2"
                                    placeholder="Enter instructions or context..."
                                    value={assignRemarks}
                                    onChange={e => setAssignRemarks(e.target.value)}
                                ></textarea>
                            </div>

                            <button
                                className="btn btn-primary-custom w-100 justify-content-center"
                                onClick={handleAssignComplaint}
                                disabled={assigning || !selectedStaff}
                            >
                                {assigning ? "Assigning..." : "Save Assignment"}
                            </button>
                        </div>

                        {/* Status & Resolution Update Card */}
                        <div className="custom-card p-4">
                            <h6 className="fw-bold text-dark mb-2">Update Status & Resolution Notes</h6>
                            <p className="text-muted small mb-3">Change complaint status or add official action notes.</p>

                            <div className="mb-3">
                                <label className="form-label small fw-semibold text-secondary">Complaint Status</label>
                                <select
                                    className="form-select-custom"
                                    value={status}
                                    onChange={e => setStatus(e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Assigned">Assigned</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-semibold text-secondary">Resolution Notes / Comments</label>
                                <textarea
                                    className="form-control-custom"
                                    rows="3"
                                    placeholder="Explain the resolution details or status update..."
                                    value={resolutionNotes}
                                    onChange={e => setResolutionNotes(e.target.value)}
                                ></textarea>
                            </div>

                            <button
                                className="btn btn-outline-custom w-100 justify-content-center"
                                onClick={handleStatusUpdate}
                                disabled={updating}
                            >
                                {updating ? "Updating..." : "Update Status & Notes"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminComplaintDetails;