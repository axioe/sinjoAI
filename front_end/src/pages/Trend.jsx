import Header from "../components/Header/Header";

function Trend() {
  const words = [
    "🔥 억까",

    "🔥 갓생",

    "🔥 킹받네",

    "🔥 알잘딱깔센",

    "🔥 중꺾마",
  ];

  return (
    <>
      <Header />

      <div>
        <h1>🔥 실시간 인기 신조어 TOP 5</h1>

        <ul>
          {words.map((word, index) => (
            <li key={index}>{word}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Trend;
