import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { useLogin } from "../../../services/Member/Login/useLogin";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useState } from "react";

function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    email,
    password,
    error,
    setMail,
    setPassword,
    handleLogin
  } = useLogin();

  const onSubmit = async () => {
    setLoading(true);
    const role = await handleLogin();

    setLoading(false);
    
    if (role === "employee" || role === "manager") {
      navigate("/home");
    }
    else if (role === "admin") {
      navigate("/dashboard/admin");
    }
  }

  return (
    <>
      <div className="login-container">
        <div className="login-card">
          
          <div className="login-left"></div>

          <div className="login-right">
            <div className="login-content">
              
              <img src="https://sunluxe.com.sg/Content/Upload/Images/1764292623000.png" alt="Logo" className="logo" />
              <p className="subtitle">Sign into your account</p>

              <input
                type="email"
                placeholder="Email address"
                className="input"
                value={email}
                onChange={(e) => setMail(e.target.value)}
              />
              

              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: 40 }}
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "35%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#888",
                    fontSize: "large"
                  }}
                >
                  {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </span>
              </div>

              <p className="error">{error}</p>
              <button className="login-btn" onClick={onSubmit}>LOGIN</button>

              <p className="register">
                Don't remmember password? <span>Click here</span>
              </p>

              <p className="policy">
                Terms of use. Privacy policy
              </p>

            </div>
          </div>

        </div>
      </div>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </>
  );
}

export default LoginPage;