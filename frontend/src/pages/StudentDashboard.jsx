import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { StatusBadge, PriorityBadge } from "../components/StatusBadge";
import { PlusCircle, FileText, Clock, CheckCircle2, AlertCircle, ArrowRight, Shield, User, Mail, Sparkles } from "lucide-react";

function StudentDashboard() {
    const [user, setUser] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        // Fetch User profile & My Complaints simultaneously
        Promise.all([
            fetch("http://localhost:5000/api/student/dashboard", {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => res.json()),
            fetch("http://localhost:5000/api/complaints/my", {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => res.json())
        ])
            .then(([userData, complaintData]) => {
                if (userData.success) {
                    setUser(userData.user);
                } else {
                    localStorage.removeItem("token");
                    navigate("/");
                }

                if (complaintData.success) {
                    setComplaints(complaintData.complaints || []);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Dashboard load error:", error);
                setLoading(false);
            });
    }, [navigate]);

    const totalComplaints = complaints.length;
    const pendingCount = complaints.filter(c => c.status === "Pending").length;
    const inProgressCount = complaints.filter(c => c.status === "In Progress" || c.status === "Assigned").length;
    const resolvedCount = complaints.filter(c => c.status === "Resolved" || c.status === "Closed").length;

    const recentComplaints = complaints.slice(0, 5);

    return (
        <div className="min-vh-100 pb-5" style={{ backgroundColor: "#f8fafc" }}>
            <Navbar activeTab="dashboard" />

            <div className="container-fluid px-4 mt-4 max-w-7xl mx-auto" style={{ maxWidth: "1280px" }}>
                {/* Header Welcome Banner */}
                <div
                    className="p-4 p-md-5 rounded-4 text-white mb-4 position-relative overflow-hidden shadow-sm"
                    style={{
                        background: "linear-gradient(135deg, #312e81 0%, #4f46e5 50%, #7c3aed 100%)",
                    }}
                >
                    <div className="row align-items-center position-relative" style={{ zIndex: 1 }}>
                        <div className="col-lg-8">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <span className="badge bg-white text-primary fw-bold px-3 py-1.5 rounded-pill shadow-sm">
                                    <Sparkles size={14} className="me-1" /> Student Portal
                                </span>
                            </div>
                            <h2 className="display-6 fw-bold mb-2">Welcome back, {user?.name || "Student"}!</h2>
                            <p className="lead mb-0 text-white-50 fs-6">
                                Have an issue on campus? Submit a complaint to college authorities and track its resolution in real-time.
                            </p>
                        </div>
                        <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                            <Link to="/student/complaint" className="btn btn-light btn-lg fw-bold text-primary shadow-sm rounded-3 px-4">
                                <PlusCircle size={20} className="me-2 text-primary" /> Submit Complaint
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Statistics Grid */}
                <div className="row g-3 mb-4">
                    <div className="col-6 col-md-3">
                        <div className="stat-card" style={{ "--card-accent": "#4f46e5" }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted small fw-semibold text-uppercase mb-1">Total Complaints</p>
                                    <h3 className="fw-bold text-dark mb-0">{totalComplaints}</h3>
                                </div>
                                <div className="stat-icon bg-primary-light text-primary">
                                    <FileText size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="stat-card" style={{ "--card-accent": "#f59e0b" }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted small fw-semibold text-uppercase mb-1">Pending</p>
                                    <h3 className="fw-bold text-warning mb-0">{pendingCount}</h3>
                                </div>
                                <div className="stat-icon" style={{ backgroundColor: "#fef3c7", color: "#d97706" }}>
                                    <Clock size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="stat-card" style={{ "--card-accent": "#6366f1" }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted small fw-semibold text-uppercase mb-1">In Progress</p>
                                    <h3 className="fw-bold text-indigo mb-0" style={{ color: "#4f46e5" }}>{inProgressCount}</h3>
                                </div>
                                <div className="stat-icon" style={{ backgroundColor: "#e0e7ff", color: "#4f46e5" }}>
                                    <AlertCircle size={24} />
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
                                    <CheckCircle2 size={24} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Row: Recent Complaints & Student Info */}
                <div className="row g-4">
                    {/* Recent Complaints */}
                    <div className="col-lg-8">
                        <div className="custom-card p-4 h-100">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h5 className="fw-bold text-dark mb-1">Recent Complaints</h5>
                                    <p className="text-muted small mb-0">Track updates on your latest submitted grievances</p>
                                </div>
                                <Link to="/student/complaints" className="btn btn-sm btn-outline-custom">
                                    View All <ArrowRight size={14} />
                                </Link>
                            </div>

                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status"></div>
                                    <p className="text-muted small mt-2">Loading complaints...</p>
                                </div>
                            ) : recentComplaints.length === 0 ? (
                                <div className="text-center py-5 bg-light rounded-3 border">
                                    <FileText size={40} className="text-muted mb-2" />
                                    <h6>No complaints submitted yet</h6>
                                    <p className="text-muted small mb-3">If you encounter any issues on campus, feel free to log a request.</p>
                                    <Link to="/student/complaint" className="btn btn-sm btn-primary-custom">
                                        <PlusCircle size={16} /> Submit New Complaint
                                    </Link>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table-custom">
                                        <thead>
                                            <tr>
                                                <th>Complaint ID</th>
                                                <th>Category</th>
                                                <th>Subject</th>
                                                <th>Priority</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentComplaints.map(complaint => (
                                                <tr key={complaint._id}>
                                                    <td>
                                                        <span className="fw-bold text-dark">{complaint.complaintId}</span>
                                                    </td>
                                                    <td>{complaint.category?.name || "General"}</td>
                                                    <td>
                                                        <span className="text-truncate d-inline-block" style={{ maxWidth: "220px" }}>
                                                            {complaint.subject}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <PriorityBadge priority={complaint.priority} />
                                                    </td>
                                                    <td>
                                                        <StatusBadge status={complaint.status} />
                                                    </td>
                                                    <td>
                                                        <Link
                                                            to={`/student/complaint/${complaint._id}`}
                                                            className="btn btn-sm btn-outline-custom py-1 px-2.5"
                                                        >
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Student Profile Card */}
                    <div className="col-lg-4">
                        <div className="custom-card p-4 h-100">
                            <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                                <div className="brand-icon-box" style={{ width: "48px", height: "48px", borderRadius: "50%" }}>
                                    <User size={24} />
                                </div>
                                <div>
                                    <h6 className="fw-bold text-dark mb-0">{user?.name || "Student Name"}</h6>
                                    <span className="badge bg-primary-light text-primary fw-semibold" style={{ fontSize: "0.75rem" }}>
                                        Student Account
                                    </span>
                                </div>
                            </div>

                            <div className="d-flex flex-column gap-3 mb-4">
                                <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light border">
                                    <Mail size={18} className="text-primary" />
                                    <div>
                                        <div className="text-muted small" style={{ fontSize: "0.75rem" }}>Registered Email</div>
                                        <div className="fw-semibold text-dark small">{user?.email || "N/A"}</div>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-light border">
                                    <Shield size={18} className="text-success" />
                                    <div>
                                        <div className="text-muted small" style={{ fontSize: "0.75rem" }}>Account Status</div>
                                        <div className="fw-semibold text-success small">Verified Student</div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 rounded-3 bg-indigo-50 border border-primary-light" style={{ backgroundColor: "#e0e7ff" }}>
                                <div className="fw-bold text-indigo small mb-1" style={{ color: "#3730a3" }}>Need Assistance?</div>
                                <p className="text-muted small mb-0" style={{ fontSize: "0.8rem", color: "#4338ca" }}>
                                    For urgent emergency matters, please contact campus security or your department head directly.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentDashboard;