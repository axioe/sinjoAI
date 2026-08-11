import "../css/Dictionary.css";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const API_URL = "http://localhost:8080/api/words";

function Dictionary() {
  const [words, setWords] = useState([]);
  const [result, setResult] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();

  // 백엔드에서 신조어 전체 데이터 가져오기
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

        setWords(data);
        setResult(data);
      } catch (error) {
        console.error(error);
        setError("신조어 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, []);

  // Trend에서 단어를 클릭해서 Dictionary로 들어온 경우
  useEffect(() => {
    const selectedWord = searchParams.get("word");

    if (!selectedWord || words.length === 0) {
      return;
    }

    setKeyword(selectedWord);

    const filtered = words.filter((item) => item.word === selectedWord);

    setResult(filtered);
  }, [searchParams, words]);

  // 검색
  const searchWord = () => {
    const trimmedKeyword = keyword.trim();

    if (trimmedKeyword === "") {
      setResult(words);
      return;
    }

    const filtered = words.filter((item) => item.word.includes(trimmedKeyword));

    setResult(filtered);
  };

  // 좋아요
  const likeWord = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("좋아요 처리에 실패했습니다.");
      }

      const updatedWord = await response.json();

      // 전체 신조어 데이터의 좋아요 수 변경
      setWords((prevWords) =>
        prevWords.map((item) =>
          item.id === updatedWord.id ? updatedWord : item,
        ),
      );

      // 현재 화면에 표시되는 데이터의 좋아요 수 변경
      setResult((prevResult) =>
        prevResult.map((item) =>
          item.id === updatedWord.id ? updatedWord : item,
        ),
      );
    } catch (error) {
      console.error(error);
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="dictionary-page">
        <h1>📖 신조어 사전</h1>
        <p>신조어를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dictionary-page">
        <h1>📖 신조어 사전</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="dictionary-page">
      <h1>📖 신조어 사전</h1>

      <p className="dictionary-subtitle">
        모르는 신조어의 뜻과 사용 예시를 확인하세요.
      </p>

      <div className="dictionary-search">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchWord();
            }
          }}
          placeholder="찾고 싶은 신조어를 입력하세요"
        />

        <button onClick={searchWord}>검색</button>
      </div>

      <div className="word-list">
        {result.length > 0 ? (
          result.map((item) => (
            <div className="word-card" key={item.id}>
              <div className="word-card-header">
                <h2>{item.word}</h2>

                <button
                  className="like-button"
                  onClick={() => likeWord(item.id)}
                >
                  ❤️ {item.likes}
                </button>
              </div>

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
  );
}

export default Dictionary;
