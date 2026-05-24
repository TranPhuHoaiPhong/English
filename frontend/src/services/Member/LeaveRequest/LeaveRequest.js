import axios from "axios";
const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

export const addLeaveRequest = async (data) => {
    const accessToken =
    localStorage.getItem(
      "accessToken"
    );

  const res =
    await axios.post(

      `${API_URL}/api/client/leaverequest`,

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