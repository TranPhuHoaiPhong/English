import HomePage from "../pages/Member/HomePage/HomePage";
import LoginPage from "../pages/Member/LoginPage/LoginPage";
import Dashboard from "../pages/Admin/Dashboard";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import AdminDashboard from "../pages/Admin/Admin";
import EmployeePage from "../pages/Admin/Employee";
import LeavePage from "../pages/Admin/LeaveRequests";
import LeaveHistoryPage from "../pages/Admin/LeaveHistoryPage";

import LeaveManagerPage from "../pages/Manager/LeaveRequests"
import LeaveHistoryManagerPage from "../pages/Manager/LeaveHistoryPage"

export const routes = [
  { path: "/", element: LoginPage },
  { path: "/home", element: HomePage },

  { path: "/dashboard", element: Dashboard },
  { path: "/dashboard/admin", element: AdminDashboard },
  { path: "/dashboard/employee", element: EmployeePage },
  { path: "/dashboard/leaverequests", element: LeavePage },
  { path: "/dashboard/leavehistory", element: LeaveHistoryPage },

  { path: "/manager/leaverequests", element: LeaveManagerPage },
  { path: "/manager/leavehistory", element: LeaveManagerPage },



  { path: "*", element: NotFoundPage },
];
