import "../css/TodayWord.css";
import { useState } from "react";
import { FaSyncAlt } from "react-icons/fa";

function TodayWord() {
  const words = [
    {
      word: "알잘딱깔센",
      meaning: "알아서 잘 딱 깔끔하고 센스있게",
      example: "이번 프로젝트는 알잘딱깔센하게 처리해줘.",
      category: "업무 / 일상",
    },

    {
      word: "갓생",
      meaning: "부지런하고 계획적인 삶",
      example: "요즘 운동도 하고 공부도 하는 갓생을 살고 있어.",
      category: "라이프스타일",
    },

    {
      word: "억까",
      meaning: "억지로 까다. 부당한 비판을 받는 상황",
      example: "내가 실수한 것도 아닌데 억까 당했어.",
      category: "감정 표현",
    },
  ];

  const [today, setToday] = useState(words[0]);

  const changeWord = () => {
    const random = words[Math.floor(Math.random() * words.length)];

    setToday(random);
  };

  return (
    <>

      <div className="today-page">
        <h1>📖 오늘의 신조어</h1>

        <p className="subtitle">오늘 가장 주목받는 신조어를 확인해보세요.</p>

        <div className="today-card">
          <span className="category">{today.category}</span>

          <h2>{today.word}</h2>

          <div className="meaning">
            <h3>뜻</h3>

            <p>{today.meaning}</p>
          </div>

          <div className="example">
            <h3>예문</h3>

            <p>"{today.example}"</p>
          </div>

          <button className="refresh-btn" onClick={changeWord}>
            <FaSyncAlt />
            다른 신조어 보기
          </button>
        </div>
      </div>
    </>
  );
}

export default TodayWord;
