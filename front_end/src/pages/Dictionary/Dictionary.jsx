import Header from "../../components/Header/Header";
import "./Dictionary.css";
import { useState } from "react";

function Dictionary() {
  const words = [
    {
      word: "억까",
      meaning: "억지로 까다. 이유 없이 비판하거나 공격하는 상황",
      example: "내가 잘못한 것도 없는데 억까 당했어.",
    },

    {
      word: "갓생",
      meaning: "신(God) + 인생. 부지런하고 계획적인 삶",
      example: "요즘 운동하면서 갓생 살고 있어.",
    },

    {
      word: "킹받네",
      meaning: "열받네를 강조한 표현",
      example: "진짜 너무 킹받네.",
    },

    {
      word: "알잘딱깔센",
      meaning: "알아서 잘 딱 깔끔하고 센스있게",
      example: "이번 일은 알잘딱깔센하게 부탁해.",
    },

    {
      word: "중꺾마",
      meaning: "중요한 것은 꺾이지 않는 마음",
      example: "힘들어도 중꺾마 정신으로 도전한다.",
    },

    {
      word: "스불재",
      meaning: "스스로 불러온 재앙",
      example: "밤새 게임한 건 내 스불재다.",
    },
  ];

  const [keyword, setKeyword] = useState("");

  const [result, setResult] = useState(words);

  const searchWord = () => {
    const filtered = words.filter((item) => item.word.includes(keyword));

    setResult(filtered);
  };

  return (
    <>
      <Header />

      <div className="dictionary-page">
        <h1>📖 신조어 사전</h1>

        <p className="dictionary-subtitle">
          모르는 신조어의 뜻과 사용 예시를 확인하세요.
        </p>

        <div className="dictionary-search">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="찾고 싶은 신조어를 입력하세요"
          />

          <button onClick={searchWord}>검색</button>
        </div>

        <div className="word-list">
          {result.length > 0 ? (
            result.map((item, index) => (
              <div className="word-card" key={index}>
                <h2>{item.word}</h2>

                <div className="meaning">
                  <b>뜻</b>

                  <p>{item.meaning}</p>
                </div>

                <div className="example">
                  <b>예문</b>

                  <p>"{item.example}"</p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-result">검색 결과가 없습니다.</div>
          )}
        </div>
      </div>
    </>
  );
}

export default Dictionary;
