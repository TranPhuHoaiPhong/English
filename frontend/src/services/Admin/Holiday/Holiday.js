import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

export const getHolidays = async () => {
    const accessToken = localStorage.getItem("accessToken");

    const res =
      await axios.get(`${API_URL}/api/admin/holiday`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

    return res.data.data;
  };

export const createHoliday = async (data) => {
    const accessToken = localStorage.getItem("accessToken");

    const res =
      await axios.post(
        `${API_URL}/api/admin/holiday`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

    return res.data;
  };

export const updateHoliday = async (id, data) => {
    const accessToken = localStorage.getItem("accessToken");

    const res =
      await axios.put(
        `${API_URL}/api/admin/holiday/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

    return res.data;
  };

export const deleteHoliday = async (id) => {
    const accessToken = localStorage.getItem("accessToken");

    const res =
      await axios.delete(
        `${API_URL}/api/admin/holiday/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

    return res.data;
  };