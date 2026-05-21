import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

export const getHistoryLeaveRequest = async () => {
    const accessToken = localStorage.getItem("accessToken");

    const res = await axios.get(
        `${API_URL}/api/admin/history/leaverequests`,
        {
          headers: {
            Authorization:
              `Bearer ${accessToken}`
          }
        }
      );

    return res.data;
};