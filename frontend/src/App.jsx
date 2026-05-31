import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/Member/HomePage/HomePage";
import LoginPage from "./pages/Member/LoginPage/LoginPage";
import Dashboard from "./pages/Admin/Dashboard";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";

import AdminDashboard from "./pages/Admin/Admin";
import EmployeePage from "./pages/Admin/Employee";
import LeavePage from "./pages/Admin/LeaveRequests";
import LeaveHistoryPage from "./pages/Admin/LeaveHistoryPage";

import DashboardManager from "./pages/Manager/Dashboard"
import LeaveManagerPage from "./pages/Manager/LeaveRequests"
import LeaveHistoryManagerPage from "./pages/Manager/LeaveHistoryPage"


function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />

        {/* ADMIN LAYOUT */}
        <Route path="/dashboard" element={<Dashboard />}>
          
          {/* 👇 mấy cái này render vào Outlet */}
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="employee" element={<EmployeePage />} />
          <Route path="leaverequests" element={<LeavePage />} />
          <Route path="leavehistory" element={<LeaveHistoryPage />} />
        </Route>
 
        <Route path="/manager" element={<DashboardManager />}>
          
          {/* 👇 mấy cái này render vào Outlet */}
          {/* <Route path="admin" element={<AdminDashboard />} />
          <Route path="employee" element={<EmployeePage />} /> */}
          <Route path="leaverequests" element={<LeaveManagerPage />} />
          <Route path="leavehistory" element={<LeaveHistoryManagerPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;