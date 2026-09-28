import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        fetch("http://localhost:5000/api/student/dashboard", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {

                if (data.success) {
                    setUser(data.user);
                } else {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/");
                }

            })
            .catch((error) => {
                console.error("Error:", error);
            });

    }, [navigate]);


    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };


    return (

        <div className="bg-light min-vh-100">

            {/* Navbar */}

            <nav className="navbar navbar-dark bg-primary">

                <div className="container">

                    <span className="navbar-brand fw-bold">
                        College Complaint Management System
                    </span>

                    <button
                        className="btn btn-light"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </nav>


            {/* Dashboard */}

            <div className="container mt-4">

                <h2 className="fw-bold">
                    Student Dashboard
                </h2>

                {user && (
                    <p className="text-muted">
                        Welcome, {user.name}
                    </p>
                )}


                {/* Dashboard Cards */}

                <div className="row mt-4">

                    {/* Submit Complaint */}

                    <div className="col-md-4 mb-4">

                        <div className="card shadow-sm h-100">

                            <div className="card-body">

                                <h4>
                                    📝 Submit Complaint
                                </h4>

                                <p className="text-muted">
                                    Submit a new complaint to the college.
                                </p>

                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate("/student/complaint")}
                                >
                                    Submit Complaint
                                </button>

                            </div>

                        </div>

                    </div>


                    {/* My Complaints */}

                    <div className="col-md-4 mb-4">

                        <div className="card shadow-sm h-100">

                            <div className="card-body">

                                <h4>
                                    📋 My Complaints
                                </h4>

                                <p className="text-muted">
                                    View and track your submitted complaints.
                                </p>

                                <button
                                    className="btn btn-success"
                                    onClick={() => navigate("/student/complaints")}
                                >
                                    View Complaints
                                </button>

                            </div>

                        </div>

                    </div>


                    {/* Profile */}

                    <div className="col-md-4 mb-4">

                        <div className="card shadow-sm h-100">

                            <div className="card-body">

                                <h4>
                                    👤 My Profile
                                </h4>

                                <p className="text-muted">
                                    View your account information.
                                </p>

                                <button
                                    className="btn btn-dark"
                                    onClick={() => {
                                        alert("Profile module coming soon");
                                    }}
                                >
                                    View Profile
                                </button>

                            </div>

                        </div>

                    </div>

                </div>


                {/* User Information */}

                {user && (

                    <div className="card shadow-sm mt-3">

                        <div className="card-body">

                            <h4 className="mb-3">
                                Student Information
                            </h4>

                            <p>
                                <strong>Name:</strong> {user.name}
                            </p>

                            <p>
                                <strong>Email:</strong> {user.email}
                            </p>

                            <p>
                                <strong>Role:</strong> {user.role}
                            </p>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}

export default StudentDashboard;