import "../css/Ranking.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080/api/words";

function Ranking() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // 좋아요가 많은 신조어 TOP 5 가져오기
  useEffect(() => {
    const fetchRankingWords = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/ranking`);

        if (!response.ok) {
          throw new Error("인기 신조어 데이터를 가져오지 못했습니다.");
        }

        const data = await response.json();

        // 좋아요가 많은 순으로 정렬 후 TOP 5
        const topFive = data.sort((a, b) => b.likes - a.likes).slice(0, 5);

        setWords(topFive);
      } catch (error) {
        console.error(error);

        setError("인기 신조어 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchRankingWords();
  }, []);

  // 신조어 클릭 → 사전으로 이동
  const goToDictionary = (word) => {
    navigate(`/dictionary?word=${encodeURIComponent(word)}`);
  };

  if (loading) {
    return (
      <div className="ranking-page">
        <h1>🏆 신조어 인기 랭킹 TOP 5</h1>

        <p>인기 신조어를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ranking-page">
        <h1>🏆 신조어 인기 랭킹 TOP 5</h1>

        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="ranking-page">
      <h1>🏆 신조어 인기 랭킹 TOP 5</h1>

      <div className="rank-container">
        {words.length > 0 ? (
          words.map((item, index) => (
            <div
              className="rank-card"
              key={item.id}
              onClick={() => goToDictionary(item.word)}
            >
              <div className="rank">{index + 1}</div>

              <div className="word-info">
                <h2>{item.word}</h2>

                <p>{item.meaning}</p>
              </div>

              <div className="ranking-likes">❤️ {item.likes}</div>
            </div>
          ))
        ) : (
          <div className="no-ranking">아직 등록된 신조어가 없습니다.</div>
        )}
      </div>
    </div>
  );
}

export default Ranking;
