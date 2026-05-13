import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

export const getLeaveRequest = async () => {
    const accessToken = localStorage.getItem("accessToken");

    const res = await axios.get(
        `${API_URL}/api/client/leaverequests`,
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

export const addLeaveRequest =
  async (data) => {

    const accessToken =
      localStorage.getItem(
        "accessToken"
      );

    const res =
      await axios.post(

        `${API_URL}/api/client/leaverequests`,

        data,

        {
          headers: {
            Authorization:
              `Bearer ${accessToken}`
          }
        }
      );

    return res.data;
};

// ===== UPDATE =====

export const updateLeaveRequest =
  async (id, data) => {

    const accessToken =
      localStorage.getItem(
        "accessToken"
      );

    const res =
      await axios.put(

        `${API_URL}/api/client/leaverequests/${id}`,

        data,

        {
          headers: {
            Authorization:
              `Bearer ${accessToken}`
          }
        }
      );

    return res.data;
};

// ===== DELETE =====

export const deleteLeaveRequest =
  async (id) => {

    const accessToken =
      localStorage.getItem(
        "accessToken"
      );

    const res =
      await axios.delete(

        `${API_URL}/api/client/leaverequests/${id}`,

        {
          headers: {
            Authorization:
              `Bearer ${accessToken}`
          }
        }
      );

    return res.data;
};