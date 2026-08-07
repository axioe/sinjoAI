import Header from "../components/Header/Header";
import "../css/Translate.css";
import { useState } from "react";
import { FaArrowRight, FaCopy } from "react-icons/fa";

function Translate() {
  const [input, setInput] = useState("");

  const [result, setResult] = useState("");

  const [history, setHistory] = useState([]);

  // 임시 번역 데이터
  const dictionary = {
    억까: "억지로 비판하거나 부당한 비난을 받는 상황",

    갓생: "부지런하고 계획적인 삶",

    킹받네: "매우 화가 난다는 의미",

    알잘딱깔센: "알아서 잘 딱 깔끔하고 센스있게",
  };

  const translate = () => {
    if (!input.trim()) {
      alert("신조어를 입력해주세요.");

      return;
    }

    let translation = dictionary[input] || "등록되지 않은 신조어입니다.";

    setResult(translation);

    setHistory([
      {
        before: input,

        after: translation,
      },

      ...history,
    ]);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);

    alert("복사되었습니다.");
  };

  return (
    <>
      <Header />

      <div className="translate-page">
        <h1>✨ 신조어 번역</h1>

        <p className="translate-subtitle">
          어려운 신조어를 쉽게 이해해 보세요.
        </p>

        <div className="translate-box">
          {/* 입력 */}

          <div className="left">
            <h3>신조어 입력</h3>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="번역할 신조어를 입력하세요."
            />
          </div>

          {/* 결과 */}

          <div className="right">
            <h3>번역 결과</h3>

            <div className="result">
              {result ? (
                <>
                  <span>{result}</span>

                  <button className="copy-btn" onClick={copyResult}>
                    <FaCopy />
                  </button>
                </>
              ) : (
                "번역 결과가 표시됩니다."
              )}
            </div>
          </div>
        </div>

        <button className="translate-btn" onClick={translate}>
          번역하기
          <FaArrowRight />
        </button>

        {/* 최근 기록 */}

        {history.length > 0 && (
          <div className="recent">
            <h2>최근 번역</h2>

            {history.slice(0, 5).map((item, index) => (
              <div className="history-item" key={index}>
                <span>{item.before}</span>

                <FaArrowRight />

                <span>{item.after}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Translate;
