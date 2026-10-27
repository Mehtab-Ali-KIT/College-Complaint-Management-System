import { useNavigate, Link } from "react-router-dom";
import { ShieldAlert, LogOut, User as UserIcon, LayoutDashboard, FileText, PlusCircle, Users, Layers, CheckSquare } from "lucide-react";

function Navbar({ activeTab }) {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    const getDashboardPath = () => {
        if (user.role === "admin") return "/admin/dashboard";
        if (user.role === "staff") return "/staff/dashboard";
        return "/student/dashboard";
    };

    return (
        <header className="custom-navbar">
            <div className="container-fluid d-flex align-items-center justify-content-between px-3 px-md-4">
                {/* Brand */}
                <Link to={getDashboardPath()} className="navbar-brand-custom">
                    <div className="brand-icon-box">
                        <ShieldAlert size={22} />
                    </div>
                    <div>
                        <div className="lh-1">EduGrievance</div>
                        <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 400 }}>
                            Campus Complaint Portal
                        </span>
                    </div>
                </Link>

                {/* Quick Navigation links depending on role */}
                <div className="d-none d-md-flex align-items-center gap-2">
                    <Link
                        to={getDashboardPath()}
                        className={`btn btn-sm ${activeTab === 'dashboard' ? 'btn-primary-custom' : 'btn-outline-custom text-white border-secondary'}`}
                    >
                        <LayoutDashboard size={16} />
                        Dashboard
                    </Link>

                    {user.role === "student" && (
                        <>
                            <Link
                                to="/student/complaints"
                                className={`btn btn-sm ${activeTab === 'my-complaints' ? 'btn-primary-custom' : 'btn-outline-custom text-white border-secondary'}`}
                            >
                                <FileText size={16} />
                                My Complaints
                            </Link>
                            <Link
                                to="/student/complaint"
                                className="btn btn-sm btn-primary-custom"
                            >
                                <PlusCircle size={16} />
                                New Complaint
                            </Link>
                        </>
                    )}

                    {user.role === "staff" && (
                        <Link
                            to="/staff/dashboard"
                            className={`btn btn-sm ${activeTab === 'staff-assigned' ? 'btn-primary-custom' : 'btn-outline-custom text-white border-secondary'}`}
                        >
                            <CheckSquare size={16} />
                            Assigned Tasks
                        </Link>
                    )}

                    {user.role === "admin" && (
                        <Link
                            to="/admin/dashboard"
                            className={`btn btn-sm ${activeTab === 'admin-dashboard' ? 'btn-primary-custom' : 'btn-outline-custom text-white border-secondary'}`}
                        >
                            <Users size={16} />
                            Control Panel
                        </Link>
                    )}
                </div>

                {/* User Menu & Logout */}
                <div className="d-flex align-items-center gap-3">
                    {user.name && (
                        <div className="user-badge d-none d-sm-flex">
                            <UserIcon size={16} className="text-info" />
                            <span>{user.name}</span>
                            <span className="role-pill">{user.role}</span>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className="btn btn-sm btn-outline-danger d-flex align-items-center gap-2 rounded-pill px-3"
                        title="Logout"
                    >
                        <LogOut size={16} />
                        <span className="d-none d-sm-inline">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
