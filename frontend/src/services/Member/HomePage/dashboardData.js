import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

export const getEmployees = async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found");
  }

  const res = await axios.get(
    `${API_URL}/api/client/home`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  return res.data.data;
};

export const logoutEmployee = async () => {

    const accessToken =
      localStorage.getItem(
        "accessToken"
      );

    if (!accessToken) {

      throw new Error(
        "No access token found"
      );
    }

    const res =
      await axios.post(

        `${API_URL}/api/client/sign-out`,

        {},

        {
          headers: {
            Authorization:
              `Bearer ${accessToken}`
          },

          withCredentials: true
        }
      );

    return res.data;
};