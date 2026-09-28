import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SubmitComplaint() {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        category: "",
        subject: "",
        description: "",
        priority: "Medium"
    });

    const [loading, setLoading] = useState(false);

    // GET CATEGORIES
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        fetch("http://localhost:5000/api/categories")
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setCategories(data.categories);
                } else {
                    alert(data.message);
                }
            })
            .catch((error) => {
                console.error("Category Error:", error);
                alert("Unable to load categories");
            });
    }, [navigate]);

    // HANDLE INPUT
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // SUBMIT COMPLAINT
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/complaints",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (data.success) {
                alert("Complaint submitted successfully!");

                navigate("/student/complaints");
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.error("Complaint Error:", error);
            alert("Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-light min-vh-100">

            {/* NAVBAR */}
            <nav className="navbar navbar-dark bg-primary">
                <div className="container">

                    <span className="navbar-brand fw-bold">
                        College Complaint Management System
                    </span>

                    <button
                        className="btn btn-light"
                        onClick={() => navigate("/student/dashboard")}
                    >
                        Dashboard
                    </button>

                </div>
            </nav>


            {/* FORM */}
            <div className="container mt-4">

                <div className="row justify-content-center">

                    <div className="col-md-8">

                        <div className="card shadow">

                            <div className="card-body p-4">

                                <h2 className="text-center mb-4">
                                    Submit Complaint
                                </h2>

                                <form onSubmit={handleSubmit}>

                                    {/* CATEGORY */}
                                    <div className="mb-3">

                                        <label className="form-label">
                                            Complaint Category
                                        </label>

                                        <select
                                            name="category"
                                            className="form-select"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                        >

                                            <option value="">
                                                Select Category
                                            </option>

                                            {categories.map((category) => (
                                                <option
                                                    key={category._id}
                                                    value={category._id}
                                                >
                                                    {category.name}
                                                </option>
                                            ))}

                                        </select>

                                    </div>


                                    {/* SUBJECT */}
                                    <div className="mb-3">

                                        <label className="form-label">
                                            Subject
                                        </label>

                                        <input
                                            type="text"
                                            name="subject"
                                            className="form-control"
                                            placeholder="Enter complaint subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>


                                    {/* DESCRIPTION */}
                                    <div className="mb-3">

                                        <label className="form-label">
                                            Description
                                        </label>

                                        <textarea
                                            name="description"
                                            className="form-control"
                                            rows="5"
                                            placeholder="Describe your complaint"
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                        ></textarea>

                                    </div>


                                    {/* PRIORITY */}
                                    <div className="mb-3">

                                        <label className="form-label">
                                            Priority
                                        </label>

                                        <select
                                            name="priority"
                                            className="form-select"
                                            value={formData.priority}
                                            onChange={handleChange}
                                        >

                                            <option value="Low">
                                                Low
                                            </option>

                                            <option value="Medium">
                                                Medium
                                            </option>

                                            <option value="High">
                                                High
                                            </option>

                                        </select>

                                    </div>


                                    {/* BUTTONS */}
                                    <div className="d-flex gap-2">

                                        <button
                                            type="submit"
                                            className="btn btn-primary flex-grow-1"
                                            disabled={loading}
                                        >
                                            {loading
                                                ? "Submitting..."
                                                : "Submit Complaint"}
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() =>
                                                navigate(
                                                    "/student/dashboard"
                                                )
                                            }
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </form>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default SubmitComplaint;