import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { useLogin } from "../../services/Login/useLogin";

function LoginPage() {
  const navigate = useNavigate();

  const {
    email,
    password,
    error,
    setMail,
    setPassword,
    handleLogin
  } = useLogin();

  const onSubmit = () => {
    const isValid = handleLogin();
    if (isValid) {
      navigate("/home");
    }
  }

  return (
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
            

            <input
              type="password"
              placeholder="Password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="error">{error}</p>}
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
  );
}

export default LoginPage;