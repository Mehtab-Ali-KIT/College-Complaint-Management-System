import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { StatusBadge, PriorityBadge } from "../components/StatusBadge";
import { Toast } from "../components/Toast";
import {
    FileText,
    Clock,
    UserCheck,
    AlertCircle,
    CheckCircle2,
    Users,
    Layers,
    PlusCircle,
    Search,
    RefreshCw,
    Eye,
    Shield,
    Mail,
    Phone,
    UserPlus,
    FolderPlus,
    X,
    Filter
} from "lucide-react";

function AdminDashboard() {
    const navigate = useNavigate();

    // Data States
    const [complaints, setComplaints] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [categoriesList, setCategoriesList] = useState([]);

    // UI States
    const [activeSection, setActiveSection] = useState("complaints"); // "complaints" | "staff" | "categories"
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [toast, setToast] = useState(null);

    // Modal States
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [showCatModal, setShowCatModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [selectedStaffId, setSelectedStaffId] = useState("");
    const [assignRemarks, setAssignRemarks] = useState("");

    // Form inputs for new Staff
    const [newStaffName, setNewStaffName] = useState("");
    const [newStaffEmail, setNewStaffEmail] = useState("");
    const [newStaffPhone, setNewStaffPhone] = useState("");
    const [newStaffPass, setNewStaffPass] = useState("");

    // Form inputs for new Category
    const [newCatName, setNewCatName] = useState("");
    const [newCatDesc, setNewCatDesc] = useState("");

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchAllData = () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (!token || user.role !== "admin") {
            navigate("/");
            return;
        }

        Promise.all([
            fetch("http://localhost:5000/api/complaints", {
                headers: { Authorization: `Bearer ${token}` }
            }).then(r => r.json()),
            fetch("http://localhost:5000/api/staff", {
                headers: { Authorization: `Bearer ${token}` }
            }).then(r => r.json()),
            fetch("http://localhost:5000/api/categories", {
                headers: { Authorization: `Bearer ${token}` }
            }).then(r => r.json())
        ])
            .then(([compData, staffData, catData]) => {
                if (compData.success) setComplaints(compData.complaints || []);
                if (staffData.success) setStaffList(staffData.staff || []);
                if (catData.success) setCategoriesList(catData.categories || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Admin dashboard fetch error:", err);
                showToast("error", "Failed to load dashboard data.");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // Filter complaints
    const filteredComplaints = complaints.filter(c => {
        const matchesStatus = statusFilter === "All" || c.status === statusFilter;
        const matchesQuery =
            c.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.complaintId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.category?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesQuery;
    });

    // Counts
    const totalComplaints = complaints.length;
    const pendingCount = complaints.filter(c => c.status === "Pending").length;
    const assignedCount = complaints.filter(c => c.status === "Assigned").length;
    const inProgressCount = complaints.filter(c => c.status === "In Progress").length;
    const resolvedCount = complaints.filter(c => c.status === "Resolved" || c.status === "Closed").length;

    // Handle Create Staff
    const handleCreateStaff = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:5000/api/staff", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: newStaffName,
                    email: newStaffEmail,
                    phone: newStaffPhone,
                    password: newStaffPass
                })
            });
            const data = await res.json();
            if (data.success) {
                showToast("success", "Staff member created successfully!");
                setShowStaffModal(false);
                setNewStaffName("");
                setNewStaffEmail("");
                setNewStaffPhone("");
                setNewStaffPass("");
                fetchAllData();
            } else {
                showToast("error", data.message || "Failed to create staff.");
            }
        } catch (err) {
            showToast("error", "Server connection error");
        }
    };

    // Handle Create Category
    const handleCreateCategory = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:5000/api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: newCatName,
                    description: newCatDesc
                })
            });
            const data = await res.json();
            if (data.success) {
                showToast("success", "Category created successfully!");
                setShowCatModal(false);
                setNewCatName("");
                setNewCatDesc("");
                fetchAllData();
            } else {
                showToast("error", data.message || "Failed to create category.");
            }
        } catch (err) {
            showToast("error", "Server connection error");
        }
    };

    // Handle Quick Assign Staff
    const handleAssignStaff = async (e) => {
        e.preventDefault();
        if (!selectedStaffId || !selectedComplaint) return;
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:5000/api/assignments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    complaintId: selectedComplaint._id,
                    staffId: selectedStaffId,
                    remarks: assignRemarks
                })
            });
            const data = await res.json();
            if (data.success) {
                showToast("success", "Complaint assigned successfully!");
                setShowAssignModal(false);
                setSelectedComplaint(null);
                setSelectedStaffId("");
                setAssignRemarks("");
                fetchAllData();
            } else {
                showToast("error", data.message || "Failed to assign complaint.");
            }
        } catch (err) {
            showToast("error", "Server connection error");
        }
    };

    return (
        <div className="min-vh-100 pb-5" style={{ backgroundColor: "#f8fafc" }}>
            <Navbar activeTab="admin-dashboard" />
            <Toast toast={toast} onClose={() => setToast(null)} />

            <div className="container-fluid px-4 mt-4 max-w-7xl mx-auto" style={{ maxWidth: "1280px" }}>
                {/* Admin Header Banner */}
                <div
                    className="p-4 p-md-5 rounded-4 text-white mb-4 position-relative overflow-hidden shadow-sm"
                    style={{
                        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)"
                    }}
                >
                    <div className="row align-items-center position-relative" style={{ zIndex: 1 }}>
                        <div className="col-lg-8">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <span className="badge bg-primary text-white fw-bold px-3 py-1.5 rounded-pill shadow-sm">
                                    <Shield size={14} className="me-1" /> Admin Control Center
                                </span>
                            </div>
                            <h2 className="display-6 fw-bold mb-2">College Complaint Management</h2>
                            <p className="lead mb-0 text-white-50 fs-6">
                                Oversee campus grievances, delegate complaints to dedicated staff, and monitor institutional resolution metrics.
                            </p>
                        </div>
                        <div className="col-lg-4 text-lg-end mt-3 mt-lg-0 d-flex gap-2 justify-content-lg-end">
                            <button
                                className="btn btn-light btn-md fw-bold text-dark shadow-sm rounded-3 px-3 d-flex align-items-center gap-1.5"
                                onClick={() => setShowStaffModal(true)}
                            >
                                <UserPlus size={16} /> Add Staff
                            </button>
                            <button
                                className="btn btn-outline-light btn-md fw-bold shadow-sm rounded-3 px-3 d-flex align-items-center gap-1.5"
                                onClick={() => setShowCatModal(true)}
                            >
                                <FolderPlus size={16} /> Add Category
                            </button>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="row g-3 mb-4">
                    <div className="col-6 col-md">
                        <div className="stat-card" style={{ "--card-accent": "#4f46e5" }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted small fw-semibold text-uppercase mb-1">Total Logs</p>
                                    <h3 className="fw-bold text-dark mb-0">{totalComplaints}</h3>
                                </div>
                                <div className="stat-icon bg-primary-light text-primary">
                                    <FileText size={22} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-6 col-md">
                        <div className="stat-card" style={{ "--card-accent": "#f59e0b" }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted small fw-semibold text-uppercase mb-1">Pending</p>
                                    <h3 className="fw-bold text-warning mb-0">{pendingCount}</h3>
                                </div>
                                <div className="stat-icon" style={{ backgroundColor: "#fef3c7", color: "#d97706" }}>
                                    <Clock size={22} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-6 col-md">
                        <div className="stat-card" style={{ "--card-accent": "#0284c7" }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="text-muted small fw-semibold text-uppercase mb-1">Assigned</p>
                                    <h3 className="fw-bold text-info mb-0">{assignedCount}</h3>
                                </div>
                                <div className="stat-icon" style={{ backgroundColor: "#e0f2fe", color: "#0369a1" }}>
                                    <UserCheck size={22} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-6 col-md">
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

                    <div className="col-12 col-md">
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

                {/* Navigation Tabs Header */}
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                    <div className="d-flex gap-2">
                        <button
                            className={`btn btn-sm ${activeSection === 'complaints' ? 'btn-primary-custom' : 'btn-outline-custom'}`}
                            onClick={() => setActiveSection("complaints")}
                        >
                            <FileText size={16} /> All Complaints ({totalComplaints})
                        </button>
                        <button
                            className={`btn btn-sm ${activeSection === 'staff' ? 'btn-primary-custom' : 'btn-outline-custom'}`}
                            onClick={() => setActiveSection("staff")}
                        >
                            <Users size={16} /> Staff Members ({staffList.length})
                        </button>
                        <button
                            className={`btn btn-sm ${activeSection === 'categories' ? 'btn-primary-custom' : 'btn-outline-custom'}`}
                            onClick={() => setActiveSection("categories")}
                        >
                            <Layers size={16} /> Categories ({categoriesList.length})
                        </button>
                    </div>

                    <button
                        className="btn btn-sm btn-outline-custom d-flex align-items-center gap-1.5"
                        onClick={fetchAllData}
                        title="Refresh Data"
                    >
                        <RefreshCw size={14} className={loading ? "spin" : ""} /> Refresh
                    </button>
                </div>

                {/* Section 1: All Complaints */}
                {activeSection === "complaints" && (
                    <>
                        {/* Search and Filters */}
                        <div className="custom-card p-3 mb-4">
                            <div className="row g-3 align-items-center">
                                <div className="col-md-5">
                                    <div className="position-relative">
                                        <input
                                            type="text"
                                            className="form-control-custom ps-5"
                                            placeholder="Search ID, title, student, or category..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        <Search size={18} className="position-absolute text-muted" style={{ left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                                    </div>
                                </div>
                                <div className="col-md-7">
                                    <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                                        {["All", "Pending", "Assigned", "In Progress", "Resolved", "Closed"].map(status => (
                                            <button
                                                key={status}
                                                onClick={() => setStatusFilter(status)}
                                                className={`btn btn-sm ${statusFilter === status ? 'btn-primary-custom' : 'btn-outline-custom'}`}
                                                style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Complaints Data Table */}
                        <div className="custom-card p-4">
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status"></div>
                                    <p className="text-muted small mt-2">Loading campus complaints...</p>
                                </div>
                            ) : filteredComplaints.length === 0 ? (
                                <div className="text-center py-5 bg-light rounded-3 border">
                                    <FileText size={44} className="text-muted mb-2" />
                                    <h5>No complaints found</h5>
                                    <p className="text-muted small mb-0">Try changing your search term or filter parameters.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table-custom">
                                        <thead>
                                            <tr>
                                                <th>Complaint ID</th>
                                                <th>Student</th>
                                                <th>Category</th>
                                                <th>Subject</th>
                                                <th>Priority</th>
                                                <th>Status</th>
                                                <th>Submitted</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredComplaints.map(complaint => (
                                                <tr key={complaint._id}>
                                                    <td>
                                                        <span className="fw-bold text-dark">{complaint.complaintId}</span>
                                                    </td>
                                                    <td>
                                                        <div className="fw-semibold text-dark">{complaint.student?.name || "Anonymous"}</div>
                                                        <div className="text-muted small">{complaint.student?.email || "N/A"}</div>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-light text-dark border px-2.5 py-1">
                                                            {complaint.category?.name || "General"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: "240px" }}>
                                                            {complaint.subject}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <PriorityBadge priority={complaint.priority} />
                                                    </td>
                                                    <td>
                                                        <StatusBadge status={complaint.status} />
                                                    </td>
                                                    <td className="text-muted small">
                                                        {new Date(complaint.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-1.5">
                                                            <Link
                                                                to={`/admin/complaint/${complaint._id}`}
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
                                                                    setShowAssignModal(true);
                                                                }}
                                                            >
                                                                <UserCheck size={14} /> Assign
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Section 2: Staff Members */}
                {activeSection === "staff" && (
                    <div className="custom-card p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                            <div>
                                <h4 className="fw-bold text-dark mb-1">College Staff Directory</h4>
                                <p className="text-muted small mb-0">Authorized maintenance supervisors and administrative officers</p>
                            </div>
                            <button
                                className="btn btn-primary-custom"
                                onClick={() => setShowStaffModal(true)}
                            >
                                <UserPlus size={16} /> Add New Staff Member
                            </button>
                        </div>

                        {staffList.length === 0 ? (
                            <div className="text-center py-5 bg-light rounded-3 border">
                                <Users size={44} className="text-muted mb-2" />
                                <h5>No staff members registered</h5>
                                <p className="text-muted small mb-3">Add staff accounts so complaints can be delegated.</p>
                                <button className="btn btn-sm btn-primary-custom" onClick={() => setShowStaffModal(true)}>
                                    <UserPlus size={16} /> Create First Staff
                                </button>
                            </div>
                        ) : (
                            <div className="row g-3">
                                {staffList.map(staff => (
                                    <div className="col-md-6 col-lg-4" key={staff._id}>
                                        <div className="p-3 rounded-3 border bg-white shadow-sm h-100 d-flex flex-column justify-content-between">
                                            <div className="d-flex align-items-center gap-3 mb-3">
                                                <div className="brand-icon-box" style={{ width: "42px", height: "42px", borderRadius: "10px" }}>
                                                    <Users size={20} />
                                                </div>
                                                <div>
                                                    <h6 className="fw-bold text-dark mb-0">{staff.name}</h6>
                                                    <span className="badge bg-primary-light text-primary" style={{ fontSize: "0.7rem" }}>
                                                        Staff Member
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column gap-2 text-muted small">
                                                <div className="d-flex align-items-center gap-2">
                                                    <Mail size={14} className="text-secondary" />
                                                    <span className="text-truncate">{staff.email}</span>
                                                </div>
                                                <div className="d-flex align-items-center gap-2">
                                                    <Phone size={14} className="text-secondary" />
                                                    <span>{staff.phone || "No phone updated"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Section 3: Categories */}
                {activeSection === "categories" && (
                    <div className="custom-card p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                            <div>
                                <h4 className="fw-bold text-dark mb-1">Grievance Categories</h4>
                                <p className="text-muted small mb-0">Classifications for student issues and routing</p>
                            </div>
                            <button
                                className="btn btn-primary-custom"
                                onClick={() => setShowCatModal(true)}
                            >
                                <FolderPlus size={16} /> Add New Category
                            </button>
                        </div>

                        {categoriesList.length === 0 ? (
                            <div className="text-center py-5 bg-light rounded-3 border">
                                <Layers size={44} className="text-muted mb-2" />
                                <h5>No categories configured</h5>
                            </div>
                        ) : (
                            <div className="row g-3">
                                {categoriesList.map(cat => (
                                    <div className="col-md-6 col-lg-4" key={cat._id}>
                                        <div className="p-3 rounded-3 border bg-white shadow-sm h-100">
                                            <div className="d-flex align-items-center gap-2.5 mb-2">
                                                <div className="stat-icon p-2 bg-indigo-50 text-indigo rounded-3" style={{ width: "36px", height: "36px", backgroundColor: "#e0e7ff", color: "#4f46e5" }}>
                                                    <Layers size={18} />
                                                </div>
                                                <h6 className="fw-bold text-dark mb-0">{cat.name}</h6>
                                            </div>
                                            <p className="text-muted small mb-0">{cat.description || "No description provided."}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal 1: Add Staff */}
            {showStaffModal && (
                <div className="modal d-block" style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0 shadow-lg p-3">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold text-dark">Register Staff Member</h5>
                                <button className="btn-close" onClick={() => setShowStaffModal(false)}></button>
                            </div>
                            <form onSubmit={handleCreateStaff}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold text-secondary">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control-custom"
                                            placeholder="John Miller (IT Tech)"
                                            value={newStaffName}
                                            onChange={e => setNewStaffName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold text-secondary">Email Address</label>
                                        <input
                                            type="email"
                                            className="form-control-custom"
                                            placeholder="staff@college.edu"
                                            value={newStaffEmail}
                                            onChange={e => setNewStaffEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold text-secondary">Phone Number</label>
                                        <input
                                            type="text"
                                            className="form-control-custom"
                                            placeholder="+1 555-0144"
                                            value={newStaffPhone}
                                            onChange={e => setNewStaffPhone(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold text-secondary">Default Password</label>
                                        <input
                                            type="password"
                                            className="form-control-custom"
                                            placeholder="staff123"
                                            value={newStaffPass}
                                            onChange={e => setNewStaffPass(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer border-0 pt-0">
                                    <button type="button" className="btn btn-outline-custom" onClick={() => setShowStaffModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary-custom">
                                        Create Staff Account
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal 2: Add Category */}
            {showCatModal && (
                <div className="modal d-block" style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0 shadow-lg p-3">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold text-dark">Create New Category</h5>
                                <button className="btn-close" onClick={() => setShowCatModal(false)}></button>
                            </div>
                            <form onSubmit={handleCreateCategory}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold text-secondary">Category Name</label>
                                        <input
                                            type="text"
                                            className="form-control-custom"
                                            placeholder="e.g. Sports & Fitness Equipment"
                                            value={newCatName}
                                            onChange={e => setNewCatName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold text-secondary">Description</label>
                                        <textarea
                                            className="form-control-custom"
                                            rows="3"
                                            placeholder="Briefly describe what kind of complaints fall under this category..."
                                            value={newCatDesc}
                                            onChange={e => setNewCatDesc(e.target.value)}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 pt-0">
                                    <button type="button" className="btn btn-outline-custom" onClick={() => setShowCatModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary-custom">
                                        Save Category
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal 3: Quick Assign Complaint */}
            {showAssignModal && selectedComplaint && (
                <div className="modal d-block" style={{ backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0 shadow-lg p-3">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold text-dark">Assign Complaint to Staff</h5>
                                <button className="btn-close" onClick={() => setShowAssignModal(false)}></button>
                            </div>
                            <form onSubmit={handleAssignStaff}>
                                <div className="modal-body">
                                    <div className="p-3 bg-light rounded-3 mb-3 border">
                                        <div className="fw-bold text-dark small">{selectedComplaint.complaintId}: {selectedComplaint.subject}</div>
                                        <div className="text-muted small mt-1">Student: {selectedComplaint.student?.name}</div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold text-secondary">Select Staff Member *</label>
                                        <select
                                            className="form-select-custom"
                                            value={selectedStaffId}
                                            onChange={e => setSelectedStaffId(e.target.value)}
                                            required
                                        >
                                            <option value="">-- Choose Staff --</option>
                                            {staffList.map(s => (
                                                <option key={s._id} value={s._id}>
                                                    {s.name} ({s.email})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold text-secondary">Assignment Remarks / Instructions</label>
                                        <textarea
                                            className="form-control-custom"
                                            rows="3"
                                            placeholder="Instructions for the assigned staff member..."
                                            value={assignRemarks}
                                            onChange={e => setAssignRemarks(e.target.value)}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 pt-0">
                                    <button type="button" className="btn btn-outline-custom" onClick={() => setShowAssignModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary-custom" disabled={!selectedStaffId}>
                                        Assign Task
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

export default AdminDashboard;