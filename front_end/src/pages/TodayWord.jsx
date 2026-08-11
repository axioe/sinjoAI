import "../css/TodayWord.css";
import { useEffect, useMemo, useState } from "react";
import { FaSyncAlt } from "react-icons/fa";
import { getWords } from "../api/wordApi";

/**
 * 오늘 날짜를 숫자 하나로 바꾼다. (예: 2026-08-11 → 20260811)
 * 이 값을 씨앗으로 쓰면 같은 날에는 항상 같은 단어가 나온다.
 */
function todaySeed() {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

/** 씨앗값으로 순서를 섞는다. 같은 씨앗이면 항상 같은 순서가 나온다. */
function shuffleWithSeed(list, seed) {
  const copy = [...list];
  let state = seed;

  for (let i = copy.length - 1; i > 0; i -= 1) {
    // 간단한 선형 합동 난수. 라이브러리 없이 재현 가능한 순서를 만든다.
    state = (state * 1103515245 + 12345) % 2147483648;
    const j = state % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function TodayWord() {
  const [allWords, setAllWords] = useState([]);
  const [cursor, setCursor] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    const fetchWords = async () => {
      try {
        const data = await getWords();
        if (alive) setAllWords(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        if (alive) setError("오늘의 신조어를 불러오는 데 실패했습니다.");
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchWords();

    return () => {
      alive = false;
    };
  }, []);

  /**
   * [수정] "오늘의" 신조어인데 새로고침할 때마다 바뀌고 있었다.
   *
   * 기존 코드는 Math.random() 으로 섞어 5개를 뽑았기 때문에
   * 같은 날 다시 들어와도 다른 단어가 나왔다.
   * 화면 이름이 "오늘의 신조어" 이므로 날짜를 씨앗으로 써서
   * 같은 날에는 같은 순서가 나오게 했다.
   *
   * 또 기존에는 "다른 신조어 보기" 를 누르면 남은 것 중 무작위라
   * 이미 본 단어가 다시 나오거나 두 개를 오갔다. 이제 순서대로 넘어간다.
   */
  const todayWords = useMemo(() => {
    if (allWords.length === 0) return [];
    return shuffleWithSeed(allWords, todaySeed()).slice(0, 5);
  }, [allWords]);

  const today = todayWords[cursor] ?? null;

  const changeWord = () => {
    if (todayWords.length <= 1) return;
    setCursor((prev) => (prev + 1) % todayWords.length);
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
          type="button"
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
