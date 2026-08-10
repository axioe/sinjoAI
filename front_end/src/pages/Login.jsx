import { useState } from "react";
import "../css/Login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      email,
      password,
    };

    const found = {};

    if (!email.trim()) {
      found.email = "이메일을 입력해 주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      found.email = "이메일 형식이 올바르지 않습니다.";
    }

    if (!password) {
      found.password = "비밀번호를 입력해 주세요.";
    }

    setErrors(found);

    if (Object.keys(found).length > 0) return;

    console.log(data);
    alert("로그인 성공!");
    navigate("/");
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <h2>로그인</h2>

        <div className="login-field">
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            placeholder="sinjo@example.com"
          />
          {errors.email && <p className="login-error">{errors.email}</p>}
        </div>

        <div className="login-field">
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: undefined }));
            }}
          />
          {errors.password && <p className="login-error">{errors.password}</p>}
        </div>

        <button type="submit" className="login-submit">
          로그인
        </button>

        <p className="login-footer">
          아직 계정이 없으신가요? <Link to="/Signup">회원가입</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
