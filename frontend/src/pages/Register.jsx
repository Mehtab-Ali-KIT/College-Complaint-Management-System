import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldAlert, User, Mail, Lock, Phone, UserPlus, ArrowLeft } from "lucide-react";
import { Toast } from "../components/Toast";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    phone,
                    role: "student"
                })
            });

            const data = await response.json();

            if (data.success) {
                showToast("success", "Registration successful! You can now login.");
                setTimeout(() => navigate("/"), 1500);
            } else {
                showToast("error", data.message || "Registration failed");
            }
        } catch (error) {
            console.error(error);
            showToast("error", "Server connection failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <Toast toast={toast} onClose={() => setToast(null)} />

            <div className="auth-card animate-fade-in" style={{ maxWidth: "480px" }}>
                {/* Header */}
                <div className="text-center mb-4">
                    <div className="d-inline-flex align-items-center justify-content-center brand-icon-box mb-3" style={{ width: "52px", height: "52px", borderRadius: "14px" }}>
                        <ShieldAlert size={28} />
                    </div>
                    <h3 className="fw-bold text-dark mb-1">Student Registration</h3>
                    <p className="text-muted small">Create your account to submit and track college complaints</p>
                </div>

                <form onSubmit={handleRegister}>
                    {/* Full Name */}
                    <div className="mb-3 text-start">
                        <label className="form-label small fw-semibold text-secondary">Full Name</label>
                        <div className="position-relative">
                            <input
                                type="text"
                                className="form-control-custom ps-5"
                                placeholder="Alex Johnson"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <User size={18} className="position-absolute text-muted" style={{ left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="mb-3 text-start">
                        <label className="form-label small fw-semibold text-secondary">College Email</label>
                        <div className="position-relative">
                            <input
                                type="email"
                                className="form-control-custom ps-5"
                                placeholder="student@college.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Mail size={18} className="position-absolute text-muted" style={{ left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="mb-3 text-start">
                        <label className="form-label small fw-semibold text-secondary">Phone Number (Optional)</label>
                        <div className="position-relative">
                            <input
                                type="tel"
                                className="form-control-custom ps-5"
                                placeholder="+1 555-0199"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            <Phone size={18} className="position-absolute text-muted" style={{ left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="mb-4 text-start">
                        <label className="form-label small fw-semibold text-secondary">Password</label>
                        <div className="position-relative">
                            <input
                                type="password"
                                className="form-control-custom ps-5"
                                placeholder="Create password"
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
                                <UserPlus size={18} /> Register Account
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center small text-muted mb-0">
                    Already registered?{" "}
                    <Link to="/" className="fw-semibold text-primary text-decoration-none d-inline-flex align-items-center gap-1">
                        <ArrowLeft size={14} /> Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;