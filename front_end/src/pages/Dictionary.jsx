import "../css/Dictionary.css";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getWords, likeWord as likeWordApi } from "../api/wordApi";

const CATEGORY_OPTIONS = ["일상", "인터넷", "게임", "SNS", "직장", "기타"];

function Dictionary() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likingId, setLikingId] = useState(null);

  // 즐겨찾기
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      const saved = localStorage.getItem("dictionaryFavorites");
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error(err);
      return [];
    }
  });

  // 현재 선택된 카테고리
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("word") ?? "";
  const [keyword, setKeyword] = useState(query);

  // 데이터 불러오기
  useEffect(() => {
    let alive = true;

    const fetchWords = async () => {
      try {
        const data = await getWords();

        if (alive) {
          setWords(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error(err);

        if (alive) {
          setError("신조어 데이터를 불러오는 데 실패했습니다.");
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    fetchWords();

    return () => {
      alive = false;
    };
  }, []);

  // URL의 검색어가 변경되면 input도 변경
  useEffect(() => {
    setKeyword(query);
  }, [query]);

  // 즐겨찾기 변경 시 localStorage 저장
  useEffect(() => {
    localStorage.setItem("dictionaryFavorites", JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  /**
   * 카테고리 목록
   *
   * 데이터에 category가 없는 경우
   * "기타"로 분류한다.
   */
  const categories = ["전체", ...CATEGORY_OPTIONS];

  /**
   * 검색 + 카테고리 필터 + 가나다순 정렬
   */
  const result = useMemo(() => {
    const q = query.trim().toLowerCase();

    return words
      .filter((item) => {
        // 카테고리 필터
        const itemCategory = item.category?.trim() || "기타";

        if (selectedCategory !== "전체" && itemCategory !== selectedCategory) {
          return false;
        }

        // 검색어
        if (!q) return true;

        return (
          item.word?.toLowerCase().includes(q) ||
          item.meaning?.toLowerCase().includes(q) ||
          item.example?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) =>
        (a.word ?? "").localeCompare(b.word ?? "", "ko", {
          sensitivity: "base",
        }),
      );
  }, [words, query, selectedCategory]);

  /**
   * 카테고리별로 다시 그룹화
   *
   * 결과:
   *
   * 인터넷
   *  - ㄱ...
   *  - ㄴ...
   *
   * 게임
   *  - ㄱ...
   *  - ㄴ...
   */
  const groupedWords = useMemo(() => {
    const groups = {};

    result.forEach((item) => {
      const category = item.category?.trim() || "기타";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(item);
    });

    // 카테고리 가나다순
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b, "ko"));
  }, [result]);

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
    if (likingId !== null) return;

    setLikingId(id);

    try {
      const updated = await likeWordApi(id);

      setWords((prev) =>
        prev.map((item) =>
          item.id === updated.id ? { ...item, ...updated } : item,
        ),
      );
    } catch (err) {
      console.error(err);

      setError("좋아요 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLikingId(null);
    }
  };

  // 즐겨찾기 추가/삭제
  const toggleFavorite = (id) => {
    setFavoriteIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((favoriteId) => favoriteId !== id);
      }

      return [...prev, id];
    });
  };

  const isFavorite = (id) => favoriteIds.includes(id);

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

      {/* 검색 */}
      <div className="dictionary-search">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent?.isComposing) {
              searchWord();
            }
          }}
          placeholder="찾고 싶은 신조어 또는 뜻을 입력하세요"
          aria-label="신조어 검색"
        />

        <button type="button" onClick={searchWord}>
          검색
        </button>

        {query && (
          <button type="button" onClick={resetSearch}>
            전체 보기
          </button>
        )}
      </div>

      {/* 카테고리 */}
      <div className="category-list">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={
              selectedCategory === category
                ? "category-button active"
                : "category-button"
            }
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 사전 */}
      <div className="word-list">
        {groupedWords.length > 0 ? (
          groupedWords.map(([category, categoryWords]) => (
            <section className="category-section" key={category}>
              <div className="category-title">
                <h2>{category}</h2>
                <span>{categoryWords.length}개</span>
              </div>

              <div className="category-word-list">
                {categoryWords.map((item) => (
                  <div className="word-card" key={item.id}>
                    <div className="word-card-header">
                      <div className="word-title-area">
                        <span className="word-category">{category}</span>

                        <h2>{item.word}</h2>
                      </div>

                      <div className="word-actions">
                        {/* 즐겨찾기 */}
                        <button
                          type="button"
                          className={
                            isFavorite(item.id)
                              ? "favorite-button active"
                              : "favorite-button"
                          }
                          onClick={() => toggleFavorite(item.id)}
                          aria-label={`${item.word} 즐겨찾기`}
                          title={
                            isFavorite(item.id)
                              ? "즐겨찾기 해제"
                              : "즐겨찾기 추가"
                          }
                        >
                          {isFavorite(item.id) ? "⭐" : "☆"}
                        </button>

                        {/* 좋아요 */}
                        <button
                          type="button"
                          className="like-button"
                          onClick={() => likeWord(item.id)}
                          disabled={likingId !== null}
                          aria-label={`${item.word} 좋아요`}
                        >
                          ❤️ {item.likes ?? 0}
                        </button>
                      </div>
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
                ))}
              </div>
            </section>
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
