import "./LoginPage.css";

function LoginPage() {
  return (
    <div className="login-container">
      <div className="login-card">
        
        <div className="login-left"></div>

        <div className="login-right">
          <div className="login-content">
            
            <h2 className="logo">📦 Logo</h2>
            <p className="subtitle">Sign into your account</p>

            <input
              type="email"
              placeholder="Email address"
              className="input"
            />

            <input
              type="password"
              placeholder="Password"
              className="input"
            />

            <button className="login-btn">LOGIN</button>

            <p className="forgot">Forgot password?</p>

            <p className="register">
              Don't have an account? <span>Register here</span>
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