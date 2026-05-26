import axios from "axios";
const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

export const changePassword = async (password) => {
    const accessToken =
    localStorage.getItem(
      "accessToken"
    );

  const res =
    await axios.post(

      `${API_URL}/api/client/change-password`,

      {password},

      {
        headers: {
          Authorization:
            `Bearer ${accessToken}`
        }
      }
    );

  return res.data;
};