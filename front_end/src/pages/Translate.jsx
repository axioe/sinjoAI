import "./Translate.css";
import { useState } from "react";
import API from "../api/translateApi";
import Header from "../components/Header/Header";

function Translate() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const translate = async () => {
    if (input === "") return;

    try {
      const res = await API.post("/translate", {
        text: input,
      });

      setResult(res.data.result);
    } catch (e) {
      alert("번역 실패");
    }
  };

  return (
    <div className="container">
      <Header />

      <div className="translate-page">
        <h1>신조어 번역</h1>

        <div className="translate-box">
          <div className="left">
            <h3>신조어 입력</h3>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="신조어를 입력하세요."
            />
          </div>

          <div className="right">
            <h3>표준어 번역 결과</h3>

            <div className="result">{result}</div>
          </div>
        </div>

        <button className="translate-btn" onClick={translate}>
          번역하기
        </button>
      </div>
    </div>
  );
}

export default Translate;
