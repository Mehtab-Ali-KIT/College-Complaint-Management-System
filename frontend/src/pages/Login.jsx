import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldAlert, Mail, Lock, LogIn, Sparkles, UserCheck, ShieldCheck, Wrench } from "lucide-react";
import { Toast } from "../components/Toast";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                showToast("success", "Login successful! Redirecting...");

                setTimeout(() => {
                    if (data.user.role === "admin") {
                        navigate("/admin/dashboard");
                    } else if (data.user.role === "student") {
                        navigate("/student/dashboard");
                    } else if (data.user.role === "staff") {
                        navigate("/staff/dashboard");
                    }
                }, 800);
            } else {
                showToast("error", data.message || "Invalid credentials");
            }
        } catch (error) {
            console.error(error);
            showToast("error", "Server connection failed. Make sure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const quickFill = (demoEmail, demoPass) => {
        setEmail(demoEmail);
        setPassword(demoPass);
    };

    return (
        <div className="auth-wrapper">
            <Toast toast={toast} onClose={() => setToast(null)} />

            <div className="auth-card animate-fade-in">
                {/* Header */}
                <div className="text-center mb-4">
                    <div className="d-inline-flex align-items-center justify-content-center brand-icon-box mb-3" style={{ width: "52px", height: "52px", borderRadius: "14px" }}>
                        <ShieldAlert size={28} />
                    </div>
                    <h3 className="fw-bold text-dark mb-1">Welcome Back</h3>
                    <p className="text-muted small">Sign in to College Complaint Management Portal</p>
                </div>

                {/* Quick Demo Fill Buttons */}
                <div className="p-3 mb-4 rounded-3 border bg-light">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="small fw-semibold text-secondary d-flex align-items-center gap-1">
                            <Sparkles size={14} className="text-warning" /> Demo Accounts
                        </span>
                        <span className="badge bg-secondary" style={{ fontSize: "0.65rem" }}>1-Click Fill</span>
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-primary flex-grow-1 d-flex align-items-center justify-content-center gap-1 py-1"
                            onClick={() => quickFill("student1@college.edu", "student123")}
                        >
                            <UserCheck size={13} /> Student
                        </button>
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-info flex-grow-1 d-flex align-items-center justify-content-center gap-1 py-1"
                            onClick={() => quickFill("staff1@college.edu", "staff123")}
                        >
                            <Wrench size={13} /> Staff
                        </button>
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-dark flex-grow-1 d-flex align-items-center justify-content-center gap-1 py-1"
                            onClick={() => quickFill("admin@college.edu", "admin123")}
                        >
                            <ShieldCheck size={13} /> Admin
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin}>
                    <div className="mb-3 text-start">
                        <label className="form-label small fw-semibold text-secondary">College Email</label>
                        <div className="position-relative">
                            <input
                                type="email"
                                className="form-control-custom ps-5"
                                placeholder="name@college.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Mail size={18} className="position-absolute text-muted" style={{ left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                        </div>
                    </div>

                    <div className="mb-4 text-start">
                        <label className="form-label small fw-semibold text-secondary">Password</label>
                        <div className="position-relative">
                            <input
                                type="password"
                                className="form-control-custom ps-5"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Lock size={18} className="position-absolute text-muted" style={{ left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary-custom w-100 justify-content-center py-2.5 mb-3"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                        ) : (
                            <>
                                <LogIn size={18} /> Sign In
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center small text-muted mb-0">
                    Don't have an account?{" "}
                    <Link to="/register" className="fw-semibold text-primary text-decoration-none">
                        Register Student Account
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;