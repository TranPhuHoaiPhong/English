import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

export const getLeaveRequestManager = async () => {
    const accessToken = localStorage.getItem("accessToken");

    const res = await axios.get(
        `${API_URL}/api/manager/leaverequests`,
        {
          headers: {
            Authorization:
              `Bearer ${accessToken}`
          }
        }
      );

    return res.data;
};

// ===== APPROVE =====
export const ApproveLeaveRequest = async (id) => {
    const accessToken =
      localStorage.getItem(
        "accessToken"
      );
    const res =
      await axios.put(   
        `${API_URL}/api/manager/leaverequest/${id}/approve`,
        {
          status: "APPROVED"
        },
        {
          headers: {
            Authorization:
              `Bearer ${accessToken}`
          }
        }
      );    
    return res.data;
};

// ===== REJECT ===== 
export const RejectLeaveRequest = async (id, rejectReason) => {
    const accessToken =
      localStorage.getItem(
        "accessToken"
      );
    const res =
      await axios.put(
        `${API_URL}/api/manager/leaverequest/${id}/reject`,
        {
          rejectReason
        },
        {
          headers: {
            Authorization:
              `Bearer ${accessToken}`
          }
        }
      );    
    return res.data;
};
