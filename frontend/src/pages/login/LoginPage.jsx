import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api"; 
import toast from "react-hot-toast"; 
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
  };

  const handleLogin = async () => {
    if (!credentials.username || !credentials.password) {
      toast.error("Vui lòng nhập đầy đủ tài khoản và mật khẩu");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", credentials);
      const { token, user, permissions } = res.data; 
      
      // 1. Lưu token để xác thực API
      localStorage.setItem("token", token);
      
      // 2. Lưu các thông tin User riêng lẻ để Sidebar dùng
      localStorage.setItem("user_id", user.id);
      localStorage.setItem("user_name", user.fullName);
      localStorage.setItem("user_role", user.username); // Hoặc roleId tùy nhu cầu
      localStorage.setItem("userPermissions", JSON.stringify(permissions));
      // 3. Lưu toàn bộ object user để dùng chung
      localStorage.setItem("currentUser", JSON.stringify(user));
      
      toast.success("Đăng nhập thành công!");
      navigate("/"); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Sai tài khoản hoặc mật khẩu!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="brand-row">
          <span className="brand-icon" aria-hidden="true">
            <span className="material-symbols-outlined brand-icon-glyph">dataset</span>
          </span>
          <span className="brand-name">CRM Việt</span>
        </div>
        <h1 className="hero-title">Trí tuệ động lực<br /><span>cho đội ngũ bán hàng.</span></h1>
        <p className="hero-copy">Trải nghiệm quy trình làm việc mật độ cao...</p>
        <div className="stat-grid">
          <div className="stat-box"><strong>99.9%</strong><p>Uptime</p></div>
          <div className="stat-box"><strong>256-bit</strong><p>Bảo mật</p></div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-box">
          <h2>Chào mừng trở lại</h2>
          <p>Vui lòng nhập thông tin để đăng nhập.</p>

          <label htmlFor="username" className="field-label">Tên đăng nhập</label>
          <div className="input-wrap username-wrap">
            <span className="material-symbols-outlined input-icon user">person</span>
            <input 
               id="username" 
               type="text" 
               placeholder="Tên đăng nhập" 
               value={credentials.username}
               onChange={handleChange}
            />
          </div>

          <div className="password-head">
            <label htmlFor="password" className="field-label">Mật khẩu</label>
          </div>
          <div className="input-wrap password-wrap">
            <span className="material-symbols-outlined input-icon lock">lock</span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={credentials.password}
              onChange={handleChange}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()} 
            />
            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              <span className="material-symbols-outlined input-icon eye">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>

          <button className="login-btn" onClick={handleLogin} disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : <>Đăng nhập <span>→</span></>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;