import { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault(); // 폼 기본 동작(새로고침)을 막는다

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

    // TODO: 서버 연동 시 여기에 로그인 요청을 넣는다
    console.log("로그인 시도", { email, password });
    alert("입력값 검증 통과");
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <h1 className="login-title">로그인</h1>

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
            placeholder="비밀번호를 입력하세요"
          />
          {errors.password && <p className="login-error">{errors.password}</p>}
        </div>

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