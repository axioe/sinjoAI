import { useState } from "react";
import "../css/Login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    try {
      const res = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setErrors({ form: "이메일 또는 비밀번호가 올바르지 않습니다." });
        return;
      }

      const data = await res.json();
      login(data);
      alert("로그인 성공!");
      navigate("/");
    } catch (err) {
      console.error(err);
      setErrors({ form: "서버에 연결할 수 없습니다." });
    }
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

        {errors.form && <p className="login-error">{errors.form}</p>}

        <button type="submit" className="login-submit">
          로그인
        </button>

        <p className="login-footer">
          아직 계정이 없으신가요? <Link to="/signup">회원가입</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
