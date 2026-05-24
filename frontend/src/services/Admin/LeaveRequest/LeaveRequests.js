import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

export const getLeaveRequest = async () => {
    const accessToken = localStorage.getItem("accessToken");

    const res = await axios.get(
        `${API_URL}/api/admin/leaverequests`,
        {
          headers: {
            Authorization:
              `Bearer ${accessToken}`
          }
        }
      );

    return res.data;
};

// ===== CREATE =====

export const addLeaveRequest = async (data) => {
    const accessToken =
    localStorage.getItem(
      "accessToken"
    );

  const res =
    await axios.post(

      `${API_URL}/api/admin/leaverequest`,

      data,

      {
        headers: {
          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "multipart/form-data"
        }
      }
    );

  return res.data;
};

// ===== UPDATE =====

export const updateLeaveRequest = async (id, data) => {

    const accessToken =
      localStorage.getItem(
        "accessToken"
      );

    try {

      const res =
        await axios.put(
          `${API_URL}/api/admin/leaverequest/${id}`,
          data,
          {
            headers: {
              Authorization:
                `Bearer ${accessToken}`
            }
          }
        );

      return res.data;

    } catch (error) {
      throw new Error(

        error.response
          ?.data
          ?.message ||

        "Update failed"
      );
    }
};

// ===== DELETE =====

export const deleteLeaveRequest = async (id) => {
    const accessToken =
      localStorage.getItem(
        "accessToken"
      );

    const res =
      await axios.delete(

        `${API_URL}/api/admin/leaverequest/${id}`,

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
        `${API_URL}/api/admin/leaverequest/${id}/approve`,
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
export const RejectLeaveRequest = async (id) => {
    const accessToken =
      localStorage.getItem(
        "accessToken"
      );
    const res =
      await axios.put(
        `${API_URL}/api/admin/leaverequest/${id}/reject`,
        {
          status: "REJECTED"
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
