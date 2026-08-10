import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/signup.css";

function Signup() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const setField = (name) => (e) => {
    setForm((prev) => ({ ...prev, [name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  };

  const validate = () => {
    const found = {};

    if (!form.email.trim()) {
      found.email = "이메일을 입력해 주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      found.email = "이메일 형식이 올바르지 않습니다.";
    }

    if (!form.password) {
      found.password = "비밀번호를 입력해 주세요.";
    } else if (form.password.length < 8) {
      found.password = "비밀번호는 8자 이상이어야 합니다.";
    }

    if (form.password !== form.passwordConfirm) {
      found.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }

    return found;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:8080/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      if (!res.ok) {
        // 서버가 내려준 메시지를 그대로 보여준다.
        // 이게 없으면 사용자는 왜 실패했는지 알 수 없다.
        const data = await res.json().catch(() => null);
        setErrors({
          ...(data?.fieldErrors ?? {}),
          form: data?.message ?? "회원가입에 실패했습니다.",
        });
        return;
      }

      alert("회원가입이 완료되었습니다. 로그인해 주세요.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setErrors({ form: "서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit} noValidate>
        <h2>회원가입</h2>

        {errors.form && <p className="signup-alert">{errors.form}</p>}

        <input
          type="email"
          placeholder="example@email.com"
          value={form.email}
          onChange={setField("email")}
          autoComplete="email"
        />
        {errors.email && <p className="signup-error">{errors.email}</p>}

        <input
          type="password"
          placeholder="8자 이상 비밀번호"
          value={form.password}
          onChange={setField("password")}
          autoComplete="new-password"
        />
        {errors.password && <p className="signup-error">{errors.password}</p>}

        <input
          type="password"
          placeholder="비밀번호 확인"
          value={form.passwordConfirm}
          onChange={setField("passwordConfirm")}
          autoComplete="new-password"
        />
        {errors.passwordConfirm && (
          <p className="signup-error">{errors.passwordConfirm}</p>
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? "가입 중..." : "가입하기"}
        </button>

        <p className="signup-footer">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
