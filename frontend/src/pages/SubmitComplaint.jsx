import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Toast } from "../components/Toast";
import { Send, ArrowLeft, Paperclip, AlertTriangle, Layers, Tag, AlignLeft } from "lucide-react";

function SubmitComplaint() {
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("");
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [fileName, setFileName] = useState("");

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        // Fetch categories
        fetch("http://localhost:5000/api/categories", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.categories.length > 0) {
                    setCategories(data.categories);
                    setCategory(data.categories[0]._id);
                }
            })
            .catch(err => console.error("Category fetch error:", err));
    }, [navigate]);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!category || !subject.trim() || !description.trim()) {
            showToast("error", "Please fill in all required fields.");
            return;
        }

        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:5000/api/complaints", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    category,
                    subject,
                    description,
                    priority
                })
            });

            const data = await response.json();

            if (data.success) {
                showToast("success", "Complaint submitted successfully!");
                setTimeout(() => navigate("/student/complaints"), 1200);
            } else {
                showToast("error", data.message || "Failed to submit complaint.");
            }
        } catch (error) {
            console.error("Submit error:", error);
            showToast("error", "Server connection error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 pb-5" style={{ backgroundColor: "#f8fafc" }}>
            <Navbar activeTab="dashboard" />
            <Toast toast={toast} onClose={() => setToast(null)} />

            <div className="container px-4 mt-4" style={{ maxWidth: "800px" }}>
                {/* Back Link */}
                <Link to="/student/dashboard" className="btn btn-sm btn-outline-custom mb-3">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>

                <div className="custom-card p-4 p-md-5">
                    <div className="border-bottom pb-3 mb-4">
                        <h3 className="fw-bold text-dark mb-1">Submit New Complaint</h3>
                        <p className="text-muted small mb-0">
                            Please provide clear details about your issue so campus staff can inspect and resolve it promptly.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Category Selector */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold text-secondary small d-flex align-items-center gap-1.5">
                                <Layers size={16} className="text-primary" /> Complaint Category *
                            </label>
                            <select
                                className="form-select-custom"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                {categories.length === 0 && <option value="">Loading categories...</option>}
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Priority Selector */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold text-secondary small d-flex align-items-center gap-1.5">
                                <AlertTriangle size={16} className="text-warning" /> Priority Level
                            </label>
                            <div className="d-flex gap-3">
                                {["Low", "Medium", "High"].map((prio) => (
                                    <label
                                        key={prio}
                                        className={`flex-grow-1 p-3 rounded-3 border text-center cursor-pointer transition-all ${
                                            priority === prio
                                                ? prio === "High"
                                                    ? "bg-danger text-white border-danger fw-bold"
                                                    : prio === "Low"
                                                    ? "bg-success text-white border-success fw-bold"
                                                    : "bg-warning text-dark border-warning fw-bold"
                                                : "bg-light text-muted"
                                        }`}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <input
                                            type="radio"
                                            name="priority"
                                            value={prio}
                                            checked={priority === prio}
                                            onChange={(e) => setPriority(e.target.value)}
                                            className="d-none"
                                        />
                                        {prio} Priority
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Subject */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold text-secondary small d-flex align-items-center gap-1.5">
                                <Tag size={16} className="text-primary" /> Subject / Short Title *
                            </label>
                            <input
                                type="text"
                                className="form-control-custom"
                                placeholder="e.g., Water leakage in Hostel Block B ceiling"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold text-secondary small d-flex align-items-center gap-1.5">
                                <AlignLeft size={16} className="text-primary" /> Detailed Description *
                            </label>
                            <textarea
                                className="form-control-custom"
                                rows="5"
                                placeholder="Describe the issue in detail including room numbers, timestamps, or specific locations..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        {/* Attachment Simulator */}
                        <div className="mb-4">
                            <label className="form-label fw-semibold text-secondary small d-flex align-items-center gap-1.5">
                                <Paperclip size={16} className="text-secondary" /> Attachment / Proof (Optional)
                            </label>
                            <input
                                type="file"
                                className="form-control-custom"
                                onChange={(e) => setFileName(e.target.files[0]?.name || "")}
                            />
                            {fileName && <span className="small text-success mt-1 d-block">Selected: {fileName}</span>}
                        </div>

                        {/* Submit Button */}
                        <div className="d-flex justify-content-end gap-3 pt-3 border-top">
                            <Link to="/student/dashboard" className="btn btn-outline-custom px-4">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className="btn btn-primary-custom px-4"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                ) : (
                                    <>
                                        <Send size={16} /> Submit Complaint
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SubmitComplaint;