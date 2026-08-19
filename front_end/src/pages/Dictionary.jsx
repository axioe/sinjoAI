import "../css/Dictionary.css";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { getWords, likeWord as likeWordApi } from "../api/wordApi";

const CATEGORY_OPTIONS = ["일상", "인터넷", "게임", "SNS", "직장", "기타"];

const INITIALS = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
  "#",
];

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

  // 현재 선택된 초성
  const [selectedInitial, setSelectedInitial] = useState("전체");

  // 즐겨찾기만 보기
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("word") ?? "";
  const [keyword, setKeyword] = useState(query);
  const [prevQuery, setPrevQuery] = useState(query);

  // URL 검색어(query)가 바뀌면 input도 맞춰준다.
  // useEffect 대신 렌더링 중에 처리해 불필요한 추가 렌더를 피한다.
  // (https://react.dev/learn/you-might-not-need-an-effect#adjusting-state-when-a-prop-changes)
  if (query !== prevQuery) {
    setPrevQuery(query);
    setKeyword(query);
  }

  // =========================
  // 한글 단어의 초성 가져오기
  // =========================

  const getInitial = (word = "") => {
    const first = word.trim().charAt(0);

    if (!first) {
      return "#";
    }

    const code = first.charCodeAt(0);

    // 한글 완성형 범위
    if (code >= 0xac00 && code <= 0xd7a3) {
      const initialIndex = Math.floor((code - 0xac00) / 588);

      return INITIALS[initialIndex] ?? "#";
    }

    // 한글이 아닌 경우
    return "#";
  };

  // =========================
  // 데이터 불러오기
  // =========================

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

  // =========================
  // 즐겨찾기 변경 시 localStorage 저장
  // =========================

  useEffect(() => {
    localStorage.setItem("dictionaryFavorites", JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  // =========================
  // 카테고리 목록
  // =========================

  const categories = ["전체", ...CATEGORY_OPTIONS];

  // =========================
  // 검색 + 카테고리
  // + 초성 + 즐겨찾기 필터
  // =========================

  const result = useMemo(() => {
    const q = query.trim().toLowerCase();

    return (
      words
        .filter((item) => {
          // -------------------------
          // 카테고리 필터
          // -------------------------

          const itemCategory = item.category?.trim() || "기타";

          if (
            selectedCategory !== "전체" &&
            itemCategory !== selectedCategory
          ) {
            return false;
          }

          // -------------------------
          // 초성 필터
          // -------------------------

          if (
            selectedInitial !== "전체" &&
            getInitial(item.word) !== selectedInitial
          ) {
            return false;
          }

          // -------------------------
          // 즐겨찾기 필터
          // -------------------------

          if (showFavoritesOnly && !favoriteIds.includes(item.id)) {
            return false;
          }

          // -------------------------
          // 검색어
          // -------------------------

          if (!q) {
            return true;
          }

          return (
            item.word?.toLowerCase().includes(q) ||
            item.meaning?.toLowerCase().includes(q) ||
            item.example?.toLowerCase().includes(q)
          );
        })

        // 가나다순 정렬
        .sort((a, b) =>
          (a.word ?? "").localeCompare(b.word ?? "", "ko", {
            sensitivity: "base",
          }),
        )
    );
  }, [
    words,
    query,
    selectedCategory,
    selectedInitial,
    showFavoritesOnly,
    favoriteIds,
  ]);

  // =========================
  // 초성별 그룹화
  // =========================

  const groupedWords = useMemo(() => {
    const groups = {};

    result.forEach((item) => {
      const initial = getInitial(item.word);

      if (!groups[initial]) {
        groups[initial] = [];
      }

      groups[initial].push(item);
    });

    return INITIALS.filter((initial) => groups[initial]).map((initial) => [
      initial,
      groups[initial],
    ]);
  }, [result]);

  // =========================
  // 검색
  // =========================

  const searchWord = () => {
    const trimmed = keyword.trim();

    setSearchParams(trimmed ? { word: trimmed } : {}, { replace: true });
  };

  // =========================
  // 검색 초기화
  // =========================

  const resetSearch = () => {
    setKeyword("");

    setSearchParams({}, { replace: true });
  };

  // =========================
  // 좋아요
  // =========================

  const likeWord = async (id) => {
    if (likingId !== null) {
      return;
    }

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

  // =========================
  // 즐겨찾기 추가 / 삭제
  // =========================

  const toggleFavorite = (id) => {
    setFavoriteIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((favoriteId) => favoriteId !== id);
      }

      return [...prev, id];
    });
  };

  // =========================
  // 즐겨찾기 여부
  // =========================

  const isFavorite = (id) => {
    return favoriteIds.includes(id);
  };

  // =========================
  // 즐겨찾기 전체 해제
  // =========================

  const resetFavorites = () => {
    setFavoriteIds([]);
  };

  // =========================
  // 필터 초기화
  // =========================

  const resetFilters = () => {
    setSelectedCategory("전체");
    setSelectedInitial("전체");
    setShowFavoritesOnly(false);
  };

  // =========================
  // 엑셀 다운로드
  // =========================

  const downloadExcel = () => {
    if (words.length === 0) {
      alert("다운로드할 신조어 데이터가 없습니다.");
      return;
    }

    // 엑셀에 넣을 데이터 형태로 변환
    const excelData = words.map((item, index) => ({
      번호: index + 1,
      단어: item.word ?? "",
      뜻: item.meaning ?? "",
      예문: item.example ?? "",
      카테고리: item.category?.trim() || "기타",
      좋아요: item.likes ?? 0,
      즐겨찾기: isFavorite(item.id) ? "Y" : "N",
    }));

    // 워크시트 생성
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // 열 너비 설정
    worksheet["!cols"] = [
      { wch: 8 }, // 번호
      { wch: 20 }, // 단어
      { wch: 50 }, // 뜻
      { wch: 60 }, // 예문
      { wch: 15 }, // 카테고리
      { wch: 10 }, // 좋아요
      { wch: 12 }, // 즐겨찾기
    ];

    // 워크북 생성
    const workbook = XLSX.utils.book_new();

    // 워크시트를 "신조어 사전"이라는 이름으로 추가
    XLSX.utils.book_append_sheet(workbook, worksheet, "신조어 사전");

    // 파일 다운로드
    XLSX.writeFile(workbook, "신조어_사전.xlsx");
  };

  // =========================
  // 로딩
  // =========================

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
      {/* =========================
          제목
      ========================= */}

      <h1>📖 신조어 사전</h1>

      <p className="dictionary-subtitle">
        모르는 신조어의 뜻과 사용 예시를 확인하세요.
      </p>

      {error && <p className="no-result">{error}</p>}

      {/* =========================
          검색
      ========================= */}

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
          <button type="button" onClick={resetSearch} className="reset-button">
            전체 보기
          </button>
        )}
      </div>

      <div className="excel-download-area">
        <button
          type="button"
          className="excel-download-button"
          onClick={downloadExcel}
        >
          📥 엑셀 다운로드
        </button>
      </div>

      {/* =========================
          카테고리
      ========================= */}

      <div className="category-list">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={
              selectedCategory === category && !showFavoritesOnly
                ? "category-button active"
                : "category-button"
            }
            onClick={() => {
              setSelectedCategory(category);
              setShowFavoritesOnly(false);
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* =========================
          초성 필터
      ========================= */}

      <div className="initial-list">
        {INITIALS.map((initial) => (
          <button
            key={initial}
            type="button"
            className={
              selectedInitial === initial
                ? "initial-button active"
                : "initial-button"
            }
            onClick={() => setSelectedInitial(initial)}
          >
            {initial}
          </button>
        ))}
      </div>

      {/* =========================
          즐겨찾기
      ========================= */}

      <div className="favorite-filter-area">
        <button
          type="button"
          className={
            showFavoritesOnly
              ? "category-button favorite-filter active"
              : "category-button favorite-filter"
          }
          onClick={() => setShowFavoritesOnly((prev) => !prev)}
        >
          ⭐ 즐겨찾기
        </button>

        {showFavoritesOnly && favoriteIds.length > 0 && (
          <button
            type="button"
            className="favorite-reset-button"
            onClick={resetFavorites}
          >
            즐겨찾기 전체 해제
          </button>
        )}

        {(selectedCategory !== "전체" ||
          selectedInitial !== "전체" ||
          showFavoritesOnly) && (
          <button
            type="button"
            className="filter-reset-button"
            onClick={resetFilters}
          >
            필터 초기화
          </button>
        )}
      </div>

      {/* =========================
          필터 상태 안내
      ========================= */}

      {(selectedCategory !== "전체" ||
        selectedInitial !== "전체" ||
        showFavoritesOnly) && (
        <div className="filter-info">
          <span>현재 필터</span>

          {selectedCategory !== "전체" && <strong>{selectedCategory}</strong>}

          {selectedInitial !== "전체" && <strong>{selectedInitial}</strong>}

          {showFavoritesOnly && <strong>⭐ 즐겨찾기</strong>}

          <span className="filter-count">{result.length}개</span>
        </div>
      )}

      {/* =========================
          즐겨찾기 안내
      ========================= */}

      {showFavoritesOnly && (
        <div className="favorite-info">
          ⭐ 즐겨찾기한 신조어 <strong>{favoriteIds.length}개</strong>
        </div>
      )}

      {/* =========================
          사전
      ========================= */}

      <div className="word-list">
        {groupedWords.length > 0 ? (
          groupedWords.map(([initial, initialWords]) => (
            <section className="category-section" key={initial}>
              {/* 초성 제목 */}

              <div className="category-title">
                <h2>{initial}</h2>

                <span>{initialWords.length}개</span>
              </div>

              {/* 단어 카드 */}

              <div className="category-word-list">
                {initialWords.map((item) => (
                  <div className="word-card" key={item.id}>
                    {/* 카드 상단 */}

                    <div className="word-card-header">
                      <div className="word-title-area">
                        {/* 실제 카테고리 */}

                        <span className="word-category">
                          {item.category?.trim() || "기타"}
                        </span>

                        <h2>{item.word}</h2>
                      </div>

                      {/* 버튼 영역 */}

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

                    {/* 뜻 */}

                    <div className="meaning">
                      <b>뜻</b>

                      <p>{item.meaning}</p>
                    </div>

                    {/* 예문 */}

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
            {showFavoritesOnly
              ? "즐겨찾기한 신조어가 없습니다."
              : words.length === 0
                ? "아직 등록된 신조어가 없습니다."
                : "검색 결과가 없습니다."}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dictionary;
