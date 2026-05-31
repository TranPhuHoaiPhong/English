import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { useLogin } from "../../../services/Member/Login/useLogin";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getBanner } from "../../../services/Admin/Banner/Banner";
import { Modal, Input, message } from "antd";
import { resetPw } from "../../../services/Member/Login/resetPw";

const API_URL = import.meta.env.VITE_BACKEND_URL;

function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const {
    email,
    password,
    error,
    setMail,
    setPassword,
    handleLogin,
  } = useLogin();

  // ===== login =====
  const onSubmit = async () => {
    setLoading(true);

    const role = await handleLogin();

    setLoading(false);

    if (role === "member") {
      navigate("/home");
    } else if (role === "admin") {
      navigate("/dashboard/admin");
    } else if (role === "manager") {
      navigate("/manager/leaverequests")
    }
  };

  // ===== fetch banner =====
  const fetchBanner = async () => {
    try {
      const data = await getBanner();

      const fileName = data?.data?.banner?.fileName;

      if (fileName) {
        setImageUrl(
          `${API_URL}/uploads/${fileName}`
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ===== load banner when page open =====
  useEffect(() => {
    fetchBanner();
  }, []);

const handleForgotPassword = async () => {
  try {

    if (!resetEmail) {
      message.error("Please enter email");
      return;
    }

    const result = await resetPw(resetEmail);


    if (result.status === "ERROR") {
      message.error(result.message);
      return;
    }

    message.success(result.message);

    setIsModalOpen(false);
    setResetEmail("");

  } catch (error) {
    console.log(error);
    message.error("Failed to send reset email");
  }
};

  return (
    <>
      <div className="login-container">
        <div className="login-card">

          {/* LEFT BANNER */}
          <div
            className="login-left"
            style={{
              backgroundImage: imageUrl
                ? `url(${imageUrl})`
                : "none",
            }}
          ></div>

          {/* RIGHT FORM */}
          <div className="login-right">
            <div className="login-content">

              <img
                src="https://sunluxe.com.sg/Content/Upload/Images/1764292623000.png"
                alt="Logo"
                className="logo"
              />

              <p className="subtitle">
                Sign into your account
              </p>

              <input
                type="email"
                placeholder="Email address"
                className="input"
                value={email}
                onChange={(e) =>
                  setMail(e.target.value)
                }
              />

              <div style={{ position: "relative" }}>
                <input
                  type={
                    showPassword ? "text" : "password"
                  }
                  placeholder="Password"
                  className="input"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  style={{ paddingRight: 40 }}
                />

                <span
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "35%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#888",
                    fontSize: "large",
                  }}
                >
                  {showPassword ? (
                    <EyeInvisibleOutlined />
                  ) : (
                    <EyeOutlined />
                  )}
                </span>
              </div>

              <p className="error">{error}</p>

              <button
                className="login-btn"
                onClick={onSubmit}
              >
                LOGIN
              </button>

              <p className="register">
                Don't remember password?{" "}
                <span
                  style={{
                    color: "#1677ff",
                    cursor: "pointer",
                  }}
                  onClick={() => setIsModalOpen(true)}
                >
                  Click here
                </span>
              </p>

              <p className="policy">
                Terms of use. Privacy policy
              </p>

            </div>
          </div>

        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}


      <Modal
        title="Forgot Password"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 15,
          }}
        >
          <Input
            placeholder="Enter your email"
            value={resetEmail}
            onChange={(e) =>
              setResetEmail(e.target.value)
            }
          />

          <button
            className="login-btn"
            onClick={handleForgotPassword}
          >
            RESET PASSWORD
          </button>
        </div>
      </Modal>
    </>
  );
}

export default LoginPage;