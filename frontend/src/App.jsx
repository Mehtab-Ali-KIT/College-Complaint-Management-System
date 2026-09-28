import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import MyComplaints from "./pages/MyComplaints";
import SubmitComplaint from "./pages/SubmitComplaint";
import ComplaintDetails from "./pages/ComplaintDetails";
import AdminDashboard from "./pages/AdminDashboard";
import AdminComplaintDetails from "./pages/AdminComplaintDetails";
import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffComplaintDetails from "./pages/staff/StaffComplaintDetails";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route
                    path="/student/dashboard"
                    element={<StudentDashboard />}
                />

                <Route
                    path="/student/complaints"
                    element={<MyComplaints />}
                />

                <Route
                    path="/student/complaint"
                    element={<SubmitComplaint />}
                />

                <Route
                    path="/student/complaint/:id"
                    element={<ComplaintDetails />}
                />

                <Route
                    path="/admin/dashboard"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/admin/complaint/:id"
                    element={<AdminComplaintDetails />}
                />
                <Route
                    path="/staff/dashboard"
                    element={<StaffDashboard />}
                />
                <Route
                    path="/staff/complaint/:id"
                    element={<StaffComplaintDetails />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;