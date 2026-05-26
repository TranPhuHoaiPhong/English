import axios from "axios";

const API_URL =
  import.meta.env.VITE_BACKEND_URL;

export const uploadBanner = async (file) => {

    const formData =
      new FormData();

    formData.append(
      "banner",
      file
    );

    const accessToken =
      localStorage.getItem(
        "accessToken"
      );

    const res =
      await axios.post(
        `${API_URL}/api/admin/banner`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",

            Authorization:
              `Bearer ${accessToken}`,
          },
        }
      );

    return res.data;
  };

export const getBanner = async () => {

    const accessToken =
      localStorage.getItem(
        "accessToken"
      );

    const res =
      await axios.get(
        `${API_URL}/api/admin/banner`,
        {
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
          },
        }
      );
    return res.data;
  };