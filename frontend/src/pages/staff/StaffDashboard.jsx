import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { StatusBadge, PriorityBadge } from "../../components/StatusBadge";
import { Toast } from "../../components/Toast";
import {
    CheckSquare,
    Clock,
    AlertCircle,
    CheckCircle2,
    Eye,
    Search,
    RefreshCw,
    Wrench,
    FileText,
    Check,
    Edit3
} from "lucide-react";

function StaffDashboard() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [toast, setToast] = useState(null);

    // Quick Update Status Modal State
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [modalStatus, setModalStatus] = useState("In Progress");
    const [resolutionNotes, setResolutionNotes] = useState("");
    const [updating, setUpdating] = useState(false);

    const navigate = useNavigate();

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }

            const response = await fetch("http://localhost:5000/api/assignments/my", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            if (data.success) {
                setAssignments(data.assignments || []);
            } else {
                showToast("error", data.message || "Failed to load assigned complaints.");
            }
        } catch (error) {
            console.error("FETCH ASSIGNMENTS ERROR:", error);
            showToast("error", "Server connection error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    // Filter assignments
    const filteredAssignments = assignments.filter(item => {
        const comp = item.complaint || {};
        const matchesStatus = statusFilter === "All" || comp.status === statusFilter;
        const matchesQuery =
            comp.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comp.complaintId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comp.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comp.category?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesQuery;
    });

    const totalAssigned = assignments.length;
    const inProgressCount = assignments.filter(a => a.complaint?.status === "In Progress").length;
    const resolvedCount = assignments.filter(a => a.complaint?.status === "Resolved" || a.complaint?.status === "Closed").length;
    const pendingCount = assignments.filter(a => a.complaint?.status === "Assigned" || a.complaint?.status === "Pending").length;

    const handleQuickStatusSubmit = async (e) => {
        e.preventDefault();
        if (!selectedComplaint) return;
        setUpdating(true);
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:5000/api/complaints/${selectedComplaint._id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: modalStatus,
                    resolutionNotes: resolutionNotes
                })
            });

            const data = await response.json();

            if (data.success) {
                showToast("success", "Complaint status updated successfully!");
                setShowUpdateModal(false);
                setSelectedComplaint(null);
                setResolutionNotes("");
                fetchAssignments();
            } else {
                showToast("error", data.message || "Failed to update status.");
            }
        } catch (error) {
            console.error("Quick status update error:", error);
            showToast("error", "Server connection error");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="min-vh-100 pb-5" style={{ backgroundColor: "#f8fafc" }}>
            <Navbar activeTab="staff-assigned" />
            <Toast toast={toast} onClose={() => setToast(null)} />

            <div className="container-fluid px-4 mt-4 max-w-7xl mx-auto" style={{ maxWidth: "1280px" }}>
                {/* Header Banner */}
                <div
                    className="p-4 p-md-5 rounded-4 text-white mb-4 position-relative overflow-hidden shadow-sm"
                    style={{
                        background: "linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #4f46e5 100%)"
                    }}
                >
                    <div className="row align-items-center position-relative" style={{ zIndex: 1 }}>
                        <div className="col-lg-8">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <span className="badge bg-white text-primary fw-bold px-3 py-1.5 rounded-pill shadow-sm">
                                    <Wrench size={14} className="me-1" /> Staff Technician Portal
                                </span>
                            </div>
                            <h2 className="display-6 fw-bold mb-2">Staff Operations Dashboard</h2>
                            <p className="lead mb-0 text-white-50 fs-6">
                                Review assigned student complaints, record inspection progress, and log resolutions.
                            </p>
                        </div>
                    </div>
                </div>

                {/* KPI Stat Cards */}
                <div className="row g-3 mb-4">
                    <div className="col-6 col-md-3">
                        <div className="stat-card" style={{ "--card-accent": "#0284c7" }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted small fw-semibold text-uppercase mb-1">Total Tasks</p>
                                    <h3 className="fw-bold text-dark mb-0">{totalAssigned}</h3>
                                </div>
                                <div className="stat-icon" style={{ backgroundColor: "#e0f2fe", color: "#0369a1" }}>
                                    <CheckSquare size={22} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="stat-card" style={{ "--card-accent": "#f59e0b" }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted small fw-semibold text-uppercase mb-1">Pending Action</p>
                                    <h3 className="fw-bold text-warning mb-0">{pendingCount}</h3>
                                </div>
                                <div className="stat-icon" style={{ backgroundColor: "#fef3c7", color: "#d97706" }}>
                                    <Clock size={22} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="stat-card" style={{ "--card-accent": "#6366f1" }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted small fw-semibold text-uppercase mb-1">In Progress</p>
                                    <h3 className="fw-bold" style={{ color: "#4f46e5" }}>{inProgressCount}</h3>
                                </div>
                                <div className="stat-icon" style={{ backgroundColor: "#e0e7ff", color: "#4f46e5" }}>
                                    <AlertCircle size={22} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="stat-card" style={{ "--card-accent": "#10b981" }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted small fw-semibold text-uppercase mb-1">Resolved</p>
                                    <h3 className="fw-bold text-success mb-0">{resolvedCount}</h3>
                                </div>
                                <div className="stat-icon" style={{ backgroundColor: "#d1fae5", color: "#059669" }}>
                                    <CheckCircle2 size={22} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="custom-card p-3 mb-4">
                    <div className="row g-3 align-items-center">
                        <div className="col-md-5">
                            <div className="position-relative">
                                <input
                                    type="text"
                                    className="form-control-custom ps-5"
                                    placeholder="Search assigned tasks by ID, student, or subject..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                                <Search size={18} className="position-absolute text-muted" style={{ left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                            </div>
                        </div>

                        <div className="col-md-7">
                            <div className="d-flex flex-wrap gap-2 justify-content-md-end align-items-center">
                                {["All", "Assigned", "In Progress", "Resolved"].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={`btn btn-sm ${statusFilter === status ? 'btn-primary-custom' : 'btn-outline-custom'}`}
                                        style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
                                    >
                                        {status}
                                    </button>
                                ))}
                                <button className="btn btn-sm btn-outline-custom p-1.5 ms-2" onClick={fetchAssignments} title="Refresh">
                                    <RefreshCw size={15} className={loading ? "spin" : ""} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Assigned Complaints Table */}
                <div className="custom-card p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
                        <h5 className="fw-bold text-dark mb-0">Assigned Tasks Directory</h5>
                        <span className="badge bg-primary-light text-primary fw-bold" style={{ fontSize: "0.8rem" }}>
                            {filteredAssignments.length} Tasks
                        </span>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status"></div>
                            <p className="text-muted small mt-2">Loading assigned tasks...</p>
                        </div>
                    ) : filteredAssignments.length === 0 ? (
                        <div className="text-center py-5 bg-light rounded-3 border">
                            <FileText size={44} className="text-muted mb-2" />
                            <h5>No assigned tasks found</h5>
                            <p className="text-muted small mb-0">You currently have no complaints matching this filter.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table-custom">
                                <thead>
                                    <tr>
                                        <th>Complaint ID</th>
                                        <th>Student</th>
                                        <th>Subject & Category</th>
                                        <th>Priority</th>
                                        <th>Status</th>
                                        <th>Assigned On</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAssignments.map(item => {
                                        const complaint = item.complaint || {};
                                        return (
                                            <tr key={item._id}>
                                                <td>
                                                    <span className="fw-bold text-dark">{complaint.complaintId || "N/A"}</span>
                                                </td>
                                                <td>
                                                    <div className="fw-semibold text-dark">{complaint.student?.name || "Student"}</div>
                                                    <div className="text-muted small">{complaint.student?.email || "N/A"}</div>
                                                </td>
                                                <td>
                                                    <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: "240px" }}>
                                                        {complaint.subject || "No Subject"}
                                                    </div>
                                                    <span className="badge bg-light text-muted border py-0.5 px-2 mt-0.5" style={{ fontSize: "0.7rem" }}>
                                                        {complaint.category?.name || "General"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <PriorityBadge priority={complaint.priority} />
                                                </td>
                                                <td>
                                                    <StatusBadge status={complaint.status} />
                                                </td>
                                                <td className="text-muted small">
                                                    {item.assignedAt ? new Date(item.assignedAt).toLocaleDateString() : "N/A"}
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-1.5">
                                                        <Link
                                                            to={`/staff/complaint/${complaint._id}`}
                                                            className="btn btn-sm btn-outline-custom p-1.5"
                                                            title="View Details"
                                                        >
                                                            <Eye size={15} />
                                                        </Link>
                                                        <button
                                                            className="btn btn-sm btn-primary-custom px-2.5 py-1"
                                                            style={{ fontSize: "0.78rem" }}
                                                            onClick={() => {
                                                                setSelectedComplaint(complaint);
                                                                setModalStatus(complaint.status === "Assigned" ? "In Progress" : complaint.status);
                                                                setResolutionNotes(complaint.resolutionNotes || "");
                                                                setShowUpdateModal(true);
                                                            }}
                                                        >
                                                            <Edit3 size={13} /> Update Status
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Status Modal */}
            {showUpdateModal && selectedComplaint && (
                <div className="modal d-block" style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0 shadow-lg p-3">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold text-dark">Update Complaint Work Status</h5>
                                <button className="btn-close" onClick={() => setShowUpdateModal(false)}></button>
                            </div>
                            <form onSubmit={handleQuickStatusSubmit}>
                                <div className="modal-body">
                                    <div className="p-3 bg-light rounded-3 mb-3 border">
                                        <div className="fw-bold text-dark small">{selectedComplaint.complaintId}: {selectedComplaint.subject}</div>
                                        <div className="text-muted small mt-1">Student: {selectedComplaint.student?.name}</div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold text-secondary">Work Status *</label>
                                        <select
                                            className="form-select-custom"
                                            value={modalStatus}
                                            onChange={e => setModalStatus(e.target.value)}
                                        >
                                            <option value="In Progress">In Progress (Work Underway)</option>
                                            <option value="Resolved">Resolved (Issue Fixed)</option>
                                            <option value="Closed">Closed (Completed)</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold text-secondary">Resolution / Work Notes</label>
                                        <textarea
                                            className="form-control-custom"
                                            rows="3"
                                            placeholder="Specify actions taken, parts replaced, or inspection findings..."
                                            value={resolutionNotes}
                                            onChange={e => setResolutionNotes(e.target.value)}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 pt-0">
                                    <button type="button" className="btn btn-outline-custom" onClick={() => setShowUpdateModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary-custom" disabled={updating}>
                                        {updating ? "Saving..." : "Save Status & Notes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StaffDashboard;