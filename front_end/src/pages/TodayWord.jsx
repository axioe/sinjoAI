import "../css/TodayWord.css";
import { useEffect, useState } from "react";
import { FaSyncAlt } from "react-icons/fa";

const API_URL = "http://localhost:8080/api/words";

function TodayWord() {
  const [todayWords, setTodayWords] = useState([]);
  const [today, setToday] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 전체 신조어 중 랜덤으로 5개 선택
  const getRandomWords = (words) => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);

    return shuffled.slice(0, 5);
  };

  // 백엔드에서 신조어 데이터 가져오기
  useEffect(() => {
    const fetchWords = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("신조어 데이터를 가져오지 못했습니다.");
        }

        const data = await response.json();

        if (data.length === 0) {
          setTodayWords([]);
          setToday(null);
          return;
        }

        // 전체 데이터에서 랜덤 5개 선택
        const randomFive = getRandomWords(data);

        setTodayWords(randomFive);

        // 랜덤 5개 중 첫 번째 단어 표시
        setToday(randomFive[0]);
      } catch (error) {
        console.error(error);

        setError("오늘의 신조어를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, []);

  // 랜덤으로 뽑힌 5개 중 다른 신조어 보여주기
  const changeWord = () => {
    if (todayWords.length === 0) {
      return;
    }

    // 현재 단어를 제외한 단어들
    const otherWords = todayWords.filter((item) => item.id !== today?.id);

    if (otherWords.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * otherWords.length);

    setToday(otherWords[randomIndex]);
  };

  if (loading) {
    return (
      <div className="today-page">
        <h1>📖 오늘의 신조어</h1>

        <p className="subtitle">오늘의 신조어를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="today-page">
        <h1>📖 오늘의 신조어</h1>

        <p className="subtitle">{error}</p>
      </div>
    );
  }

  if (!today) {
    return (
      <div className="today-page">
        <h1>📖 오늘의 신조어</h1>

        <p className="subtitle">등록된 신조어가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="today-page">
      <h1>📖 오늘의 신조어</h1>

      <p className="subtitle">오늘 가장 주목받는 신조어를 확인해보세요.</p>

      <div className="today-card">
        {today.category && <span className="category">{today.category}</span>}

        <h2>{today.word}</h2>

        <div className="meaning">
          <h3>뜻</h3>

          <p>{today.meaning}</p>
        </div>

        <div className="example">
          <h3>예문</h3>

          <p>"{today.example}"</p>
        </div>

        <button
          className="refresh-btn"
          onClick={changeWord}
          disabled={todayWords.length <= 1}
        >
          <FaSyncAlt />
          다른 신조어 보기
        </button>
      </div>
    </div>
  );
}

export default TodayWord;
