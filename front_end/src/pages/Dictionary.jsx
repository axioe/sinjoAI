import "../css/Dictionary.css";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getWords, likeWord as likeWordApi } from "../api/wordApi";

function Dictionary() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likingId, setLikingId] = useState(null);

  // [수정] 검색어를 URL 에 담는다.
  // 랭킹 화면에서 ?word=억까 로 들어오는 경우와 직접 검색하는 경우를
  // "URL 하나"로 통일하면, 검색 결과를 그대로 공유하거나 새로고침해도 유지된다.
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("word") ?? "";
  const [keyword, setKeyword] = useState(query);

  useEffect(() => {
    let alive = true;

    const fetchWords = async () => {
      try {
        const data = await getWords();
        if (alive) setWords(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        if (alive) setError("신조어 데이터를 불러오는 데 실패했습니다.");
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
   * [수정] 검색 결과를 state 로 따로 들고 있지 않고 words + query 에서 계산한다.
   *
   * 기존에는 words 와 result 두 개의 state 를 두고
   * useEffect 안에서 setKeyword / setResult 를 호출했다.
   * 이 방식은 렌더가 연쇄로 일어나 느려지고,
   * eslint 의 react-hooks/set-state-in-effect 규칙에도 걸려
   * npm run lint 가 실패하고 있었다.
   *
   * 함께 고친 것:
   *  - 앞뒤 공백 제거 / 대소문자 무시
   *  - 단어뿐 아니라 뜻(meaning)까지 검색 대상에 포함
   */
  const result = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return words;

    return words.filter(
      (item) =>
        item.word?.toLowerCase().includes(q) ||
        item.meaning?.toLowerCase().includes(q),
    );
  }, [words, query]);

  const searchWord = () => {
    const trimmed = keyword.trim();
    setSearchParams(trimmed ? { word: trimmed } : {}, { replace: true });
  };

  const resetSearch = () => {
    setKeyword("");
    setSearchParams({}, { replace: true });
  };

  // 좋아요
  const likeWord = async (id) => {
    // [수정] 연타로 여러 번 요청이 나가는 것을 막는다.
    if (likingId !== null) return;

    setLikingId(id);
    try {
      const updated = await likeWordApi(id);

      setWords((prev) =>
        prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)),
      );
    } catch (err) {
      console.error(err);
      setError("좋아요 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLikingId(null);
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

  return (
    <div className="dictionary-page">
      <h1>📖 신조어 사전</h1>

      <p className="dictionary-subtitle">
        모르는 신조어의 뜻과 사용 예시를 확인하세요.
      </p>

      {error && <p className="no-result">{error}</p>}

      <div className="dictionary-search">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            // 한글 조합 중 Enter 는 무시한다.
            if (e.key === "Enter" && !e.nativeEvent?.isComposing) {
              searchWord();
            }
          }}
          placeholder="찾고 싶은 신조어 또는 뜻을 입력하세요"
          aria-label="신조어 검색"
        />

        <button type="button" onClick={searchWord}>검색</button>
        {query && (
          <button type="button" onClick={resetSearch}>전체 보기</button>
        )}
      </div>

      <div className="word-list">
        {result.length > 0 ? (
          result.map((item) => (
            <div className="word-card" key={item.id}>
              <div className="word-card-header">
                <h2>{item.word}</h2>

                <button
                  type="button"
                  className="like-button"
                  onClick={() => likeWord(item.id)}
                  disabled={likingId !== null}
                  aria-label={`${item.word} 좋아요`}
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
          <div className="no-result">
            {words.length === 0
              ? "아직 등록된 신조어가 없습니다."
              : "검색 결과가 없습니다."}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dictionary;
