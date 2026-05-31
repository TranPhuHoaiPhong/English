import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

export const resetPw = async (gmail) => {
  try {

    const res = await axios.post(
      `${API_URL}/api/client/reset-password`,
      {
        gmail
      }
    );


    return res.data;

  } catch (error) {


    if (error.response) {
      return {
        status: "ERROR",
        message: error.response.data.message,
      };
    }

    return {
      status: "ERROR",
      message: "Something went wrong",
    };
  }
};

export const cancelRequest = async (id) => {
  try {

    const accessToken =
      localStorage.getItem("accessToken");

    const res = await axios.put(
      `${API_URL}/api/client/cancel/${id}`,
      {},
      {
        headers: {
          Authorization:
            `Bearer ${accessToken}`,
        },
      }
    );

    return res.data;

  } catch (error) {

    if (error.response) {
      return {
        status: "ERROR",
        message:
          error.response.data.message,
      };
    }

    return {
      status: "ERROR",
      message: "Something went wrong",
    };
  }
};