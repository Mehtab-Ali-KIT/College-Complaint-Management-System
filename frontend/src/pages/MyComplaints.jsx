import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { StatusBadge, PriorityBadge } from "../components/StatusBadge";
import { Search, PlusCircle, FileText, Calendar, Eye, ArrowLeft, Filter } from "lucide-react";

function MyComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        fetch("http://localhost:5000/api/complaints/my", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setComplaints(data.complaints || []);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [navigate]);

    const filteredComplaints = complaints.filter((c) => {
        const matchesStatus = statusFilter === "All" || c.status === statusFilter;
        const matchesSearch =
            c.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.complaintId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.category?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="min-vh-100 pb-5" style={{ backgroundColor: "#f8fafc" }}>
            <Navbar activeTab="my-complaints" />

            <div className="container-fluid px-4 mt-4 max-w-7xl mx-auto" style={{ maxWidth: "1280px" }}>
                {/* Header Navigation */}
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
                    <div>
                        <Link to="/student/dashboard" className="btn btn-sm btn-outline-custom mb-2">
                            <ArrowLeft size={14} /> Back to Dashboard
                        </Link>
                        <h3 className="fw-bold text-dark mb-1">My Submitted Complaints</h3>
                        <p className="text-muted small mb-0">View history, tracking status, and resolution updates</p>
                    </div>

                    <Link to="/student/complaint" className="btn btn-primary-custom">
                        <PlusCircle size={18} /> New Complaint
                    </Link>
                </div>

                {/* Filter and Search Bar Card */}
                <div className="custom-card p-3 mb-4">
                    <div className="row g-3 align-items-center">
                        {/* Search Input */}
                        <div className="col-md-5">
                            <div className="position-relative">
                                <input
                                    type="text"
                                    className="form-control-custom ps-5"
                                    placeholder="Search by ID, title, or category..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Search size={18} className="position-absolute text-muted" style={{ left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                            </div>
                        </div>

                        {/* Status Filter Pills */}
                        <div className="col-md-7">
                            <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                                {["All", "Pending", "Assigned", "In Progress", "Resolved", "Closed"].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={`btn btn-sm ${
                                            statusFilter === status
                                                ? "btn-primary-custom"
                                                : "btn-outline-custom"
                                        }`}
                                        style={{ padding: "0.4rem 0.85rem", fontSize: "0.825rem" }}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Complaints List Table */}
                <div className="custom-card p-4">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status"></div>
                            <p className="text-muted small mt-2">Loading complaints...</p>
                        </div>
                    ) : filteredComplaints.length === 0 ? (
                        <div className="text-center py-5 bg-light rounded-3 border">
                            <FileText size={44} className="text-muted mb-2" />
                            <h5>No complaints match your filter</h5>
                            <p className="text-muted small mb-0">Try changing your search term or filter options.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table-custom">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Category</th>
                                        <th>Subject</th>
                                        <th>Priority</th>
                                        <th>Status</th>
                                        <th>Submitted On</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredComplaints.map((complaint) => (
                                        <tr key={complaint._id}>
                                            <td>
                                                <span className="fw-bold text-dark">{complaint.complaintId}</span>
                                            </td>
                                            <td>
                                                <span className="badge bg-light text-dark border px-2.5 py-1">
                                                    {complaint.category?.name || "General"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="fw-semibold text-dark" style={{ maxWidth: "280px" }}>
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
                                                <Calendar size={14} className="me-1" />
                                                {new Date(complaint.createdAt).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/student/complaint/${complaint._id}`}
                                                    className="btn btn-sm btn-outline-custom d-inline-flex align-items-center gap-1"
                                                >
                                                    <Eye size={14} /> View
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
        </div>
    );
}

export default MyComplaints;