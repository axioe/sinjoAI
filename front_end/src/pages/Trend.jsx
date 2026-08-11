import "../css/Trend.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080/api/words";

function Trend() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // 좋아요가 많은 신조어 TOP 5 가져오기
  useEffect(() => {
    const fetchTrendingWords = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/trending`);

        if (!response.ok) {
          throw new Error("인기 신조어 데이터를 가져오지 못했습니다.");
        }

        const data = await response.json();

        setWords(data);
      } catch (error) {
        console.error(error);
        setError("인기 신조어 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingWords();
  }, []);

  // 신조어 클릭 → Dictionary로 이동
  const goToDictionary = (word) => {
    navigate(`/dictionary?word=${encodeURIComponent(word)}`);
  };

  if (loading) {
    return (
      <div className="trend-page">
        <h1>🔥 실시간 인기 신조어 TOP 5</h1>
        <p>인기 신조어를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trend-page">
        <h1>🔥 실시간 인기 신조어 TOP 5</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="trend-page">
      <h1>🔥 실시간 인기 신조어 TOP 5</h1>

      <div className="rank-container">
        {words.map((item) => (
          <div
            className="rank-card"
            key={item.id}
            onClick={() => goToDictionary(item.word)}
          >
            <div className="rank">{item.rank}</div>

            <div className="word-info">
              <h2>{item.word}</h2>

              <p>{item.meaning}</p>
            </div>

            <div className="trend-likes">❤️ {item.likes}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Trend;
