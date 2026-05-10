import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

export const getDepartments = async () => {
    const accessToken = localStorage.getItem("accessToken");

    const res =
      await axios.get(`${API_URL}/api/admin/department`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

    return res.data.data;
  };

export const createDepartment = async (data) => {
    const accessToken = localStorage.getItem("accessToken");

    const res =
      await axios.post(
        `${API_URL}/api/admin/department`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

    return res.data;
  };

export const updateDepartment = async (id, data) => {
    const accessToken = localStorage.getItem("accessToken");

    const res =
      await axios.put(
        `${API_URL}/api/admin/department/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

    return res.data;
  };

export const deleteDepartment = async (id) => {
    const accessToken = localStorage.getItem("accessToken");

    const res =
      await axios.delete(
        `${API_URL}/api/admin/department/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

    return res.data;
  };