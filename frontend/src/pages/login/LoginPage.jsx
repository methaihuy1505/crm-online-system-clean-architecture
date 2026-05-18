import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Simulate login state for routing flow.
    localStorage.setItem("token", "abc123");

    navigate("/users");
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

        <h1 className="hero-title">
          Trí tuệ động lực
          <br />
          <span>cho đội ngũ bán hàng hiện đại.</span>
        </h1>

        <p className="hero-copy">
          Trải nghiệm quy trình làm việc mật độ cao, tối ưu cho độ chính xác và tốc độ.
          Quản lý người dùng, theo dõi giao dịch và mở rộng hạ tầng mà không rối mắt.
        </p>

        <div className="stat-grid">
          <div className="stat-box">
            <strong>99.9%</strong>
            <p>Thời gian hoạt động</p>
          </div>
          <div className="stat-box">
            <strong>256-bit</strong>
            <p>Mã hóa bảo mật</p>
          </div>
        </div>

        <div className="legal-links" aria-hidden="true">
          <span>Chính sách bảo mật</span>
          <span>Điều khoản dịch vụ</span>
          <span>Trung tâm hỗ trợ</span>
        </div>
      </div>

      <div className="login-right">
        <div className="login-box">
          <h2>Chào mừng trở lại</h2>
          <p>Vui lòng nhập thông tin để đăng nhập.</p>

          <label htmlFor="username" className="field-label">
            Tên đăng nhập
          </label>
          <div className="input-wrap username-wrap">
            <span className="material-symbols-outlined input-icon user" aria-hidden="true">
              person
            </span>
            <input id="username" type="text" placeholder="Tên đăng nhập" />
          </div>

          <div className="password-head">
            <label htmlFor="password" className="field-label">
              Mật khẩu
            </label>
            <button type="button" className="forgot">
              Quên mật khẩu?
            </button>
          </div>
          <div className="input-wrap password-wrap">
            <span className="material-symbols-outlined input-icon lock" aria-hidden="true">
              lock
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              <span className="material-symbols-outlined input-icon eye" aria-hidden="true">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>

          <div className="options">
            <label className="remember-row">
              <input type="checkbox" />
              <span>Duy trì đăng nhập trong 30 ngày</span>
            </label>
          </div>

          <button className="login-btn" onClick={handleLogin}>
            Đăng nhập <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <div className="copyright" aria-hidden="true">
        © 2026 CRM Systems. Bảo lưu mọi quyền.
      </div>
    </div>
  );
}

export default LoginPage;
