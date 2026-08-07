import Header from "../components/Header/Header";
import "./Trend.css";

function Trend() {
  const words = [
    {
      rank: 1,
      word: "억까",
      desc: "억지로 까다",
    },

    {
      rank: 2,
      word: "갓생",
      desc: "부지런하고 계획적인 삶",
    },

    {
      rank: 3,
      word: "킹받네",
      desc: "매우 화가 난다",
    },

    {
      rank: 4,
      word: "알잘딱깔센",
      desc: "알아서 잘 딱 깔끔하고 센스있게",
    },

    {
      rank: 5,
      word: "중꺾마",
      desc: "중요한 것은 꺾이지 않는 마음",
    },
  ];

  return (
    <>
      <Header />

      <div className="trend-page">
        <h1>🔥 실시간 인기 신조어 TOP 5</h1>

        <div className="rank-container">
          {words.map((item) => (
            <div className="rank-card" key={item.rank}>
              <div className="rank">{item.rank}</div>

              <div className="word-info">
                <h2>{item.word}</h2>

                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Trend;
