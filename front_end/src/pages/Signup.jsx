import { useState } from "react";
import "../css/signup.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // 새로고침 

    try {
      const res = await fetch("http://localhost:8080/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
        alert("회원가입 실패");
        return;
      }

    const data = await res.json();
      console.log(data);
      alert("회원가입 성공!");

    } catch (err) {
      console.error(err);
      alert("서버 연결 실패");
    }

  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>

        <h2>회원가입</h2>

        <input type="email"
        placeholder="example@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder=""
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">가입하기</button>

      </form>
    </div>
  )
}

export default Signup;