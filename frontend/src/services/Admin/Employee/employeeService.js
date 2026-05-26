import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

export const getEmployees = async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found");
  }

  const res = await axios.get(
    `${API_URL}/api/admin/employees`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  return res.data.data;
};

export const getAllEmployees = async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found");
  }
 
  const res = await axios.get(
    `${API_URL}/api/admin/all-employees`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  return res.data.data;
};

export const createEmployee = async (data) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found");
  }
 
  const res = await axios.post(
    `${API_URL}/api/admin/employees`,
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  console.log("return", data)

  return res.data;
};
 
export const updateEmployee = async (id, data) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found");
  }

  const res = await axios.put(
    `${API_URL}/api/admin/employees/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  return res.data;
};

export const deleteEmployee = async (id) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found");
  }

  const res = await axios.delete(
    `${API_URL}/api/admin/employees/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
 
  return res.data;
};

export const logoutEmployee =
  async () => {

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

        `${API_URL}/api/admin/sign-out`,

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