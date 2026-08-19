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

// 한 페이지에 보여줄 단어 수
const ITEMS_PER_PAGE = 10;

// 페이지 번호는 최대 5개
const PAGE_GROUP_SIZE = 5;

function Dictionary() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likingId, setLikingId] = useState(null);

  // 현재 페이지
  const [currentPage, setCurrentPage] = useState(1);

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

  // URL 검색어가 바뀌면 input도 맞춰준다.
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

    return words
      .filter((item) => {
        // -------------------------
        // 카테고리 필터
        // -------------------------

        const itemCategory = item.category?.trim() || "기타";

        if (selectedCategory !== "전체" && itemCategory !== selectedCategory) {
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
          item.example?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q) ||
          item.era?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) =>
        (a.word ?? "").localeCompare(b.word ?? "", "ko", {
          sensitivity: "base",
        }),
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
  // 전체 페이지 수
  // =========================

  const totalPages = Math.max(1, Math.ceil(result.length / ITEMS_PER_PAGE));

  // =========================
  // 현재 페이지 보정
  // =========================

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // =========================
  // 현재 페이지에 보여줄 단어
  // =========================

  const paginatedWords = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    const endIndex = startIndex + ITEMS_PER_PAGE;

    return result.slice(startIndex, endIndex);
  }, [result, currentPage]);

  // =========================
  // 현재 페이지 그룹
  //
  // 예:
  // 1 2 3 4 5
  // 6 7 8 9 10
  // =========================

  const currentPageGroup = Math.ceil(currentPage / PAGE_GROUP_SIZE);

  const startPage = (currentPageGroup - 1) * PAGE_GROUP_SIZE + 1;

  const endPage = Math.min(startPage + PAGE_GROUP_SIZE - 1, totalPages);

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index,
  );

  // =========================
  // 페이지 이동
  // =========================

  const goToPage = (page) => {
    const safePage = Math.min(Math.max(page, 1), totalPages);

    setCurrentPage(safePage);

    // 페이지 이동 시 사전 상단으로 이동
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // 이전 페이지
  // =========================

  const goPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  // =========================
  // 다음 페이지
  // =========================

  const goNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // =========================
  // 이전 페이지 그룹
  // <<
  //
  // 6~10페이지를 보고 있다면
  // 1페이지로 이동
  // =========================

  const goPreviousGroup = () => {
    if (currentPageGroup > 1) {
      const previousGroupFirstPage =
        (currentPageGroup - 2) * PAGE_GROUP_SIZE + 1;

      goToPage(previousGroupFirstPage);
    }
  };

  // =========================
  // 다음 페이지 그룹
  // >>
  //
  // 1~5페이지를 보고 있다면
  // 6페이지로 이동
  // =========================

  const goNextGroup = () => {
    const nextGroupFirstPage = currentPageGroup * PAGE_GROUP_SIZE + 1;

    if (nextGroupFirstPage <= totalPages) {
      goToPage(nextGroupFirstPage);
    }
  };

  // =========================
  // 검색
  // =========================

  const searchWord = () => {
    const trimmed = keyword.trim();

    setSearchParams(trimmed ? { word: trimmed } : {}, {
      replace: true,
    });

    // 검색하면 첫 페이지
    setCurrentPage(1);
  };

  // =========================
  // 검색 초기화
  // =========================

  const resetSearch = () => {
    setKeyword("");

    setSearchParams(
      {},
      {
        replace: true,
      },
    );

    setCurrentPage(1);
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
          item.id === updated.id
            ? {
                ...item,
                ...updated,
              }
            : item,
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

    setCurrentPage(1);
  };

  // =========================
  // 필터 초기화
  // =========================

  const resetFilters = () => {
    setSelectedCategory("전체");
    setSelectedInitial("전체");
    setShowFavoritesOnly(false);

    setCurrentPage(1);
  };

  // =========================
  // 카테고리 변경
  // =========================

  const changeCategory = (category) => {
    setSelectedCategory(category);
    setShowFavoritesOnly(false);

    // 필터 변경 시 첫 페이지
    setCurrentPage(1);
  };

  // =========================
  // 초성 변경
  // =========================

  const changeInitial = (initial) => {
    setSelectedInitial(initial);

    // 필터 변경 시 첫 페이지
    setCurrentPage(1);
  };

  // =========================
  // 즐겨찾기 필터 변경
  // =========================

  const toggleFavoritesOnly = () => {
    setShowFavoritesOnly((prev) => !prev);

    // 필터 변경 시 첫 페이지
    setCurrentPage(1);
  };

  // =========================
  // 엑셀 다운로드
  // =========================

  const downloadExcel = () => {
    if (words.length === 0) {
      alert("다운로드할 신조어 데이터가 없습니다.");
      return;
    }

    const excelData = words.map((item, index) => ({
      번호: index + 1,
      단어: item.word ?? "",
      뜻: item.meaning ?? "",
      예문: item.example ?? "",
      카테고리: item.category?.trim() || "기타",
      시대: item.era ?? "",
      좋아요: item.likes ?? 0,
      즐겨찾기: isFavorite(item.id) ? "Y" : "N",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    worksheet["!cols"] = [
      { wch: 8 }, // 번호
      { wch: 20 }, // 단어
      { wch: 50 }, // 뜻
      { wch: 60 }, // 예문
      { wch: 15 }, // 카테고리
      { wch: 15 }, // 시대
      { wch: 10 }, // 좋아요
      { wch: 12 }, // 즐겨찾기
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "신조어 사전");

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

      {/* =========================
          엑셀
      ========================= */}

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
            onClick={() => changeCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* =========================
          초성
      ========================= */}

      <div className="initial-list">
        <button
          type="button"
          className={
            selectedInitial === "전체"
              ? "initial-button active"
              : "initial-button"
          }
          onClick={() => changeInitial("전체")}
        >
          전체
        </button>

        {INITIALS.map((initial) => (
          <button
            key={initial}
            type="button"
            className={
              selectedInitial === initial
                ? "initial-button active"
                : "initial-button"
            }
            onClick={() => changeInitial(initial)}
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
          onClick={toggleFavoritesOnly}
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
          필터 상태
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
          현재 페이지 정보
      ========================= */}

      {result.length > 0 && (
        <div className="pagination-info">
          전체 <strong>{result.length}</strong>개<span>·</span>
          <strong>{currentPage}</strong> / {totalPages} 페이지
        </div>
      )}

      {/* =========================
          사전
      ========================= */}

      <div className="word-list">
        {paginatedWords.length > 0 ? (
          <div className="category-word-list">
            {paginatedWords.map((item) => (
              <div className="word-card" key={item.id}>
                {/* 카드 상단 */}

                <div className="word-card-header">
                  <div className="word-title-area">
                    {/* 카테고리 + 시대 */}

                    <div className="word-meta">
                      <span className="word-category">
                        {item.category?.trim() || "기타"}
                      </span>

                      {item.era?.trim() && (
                        <span className="word-era">{item.era}</span>
                      )}
                    </div>

                    <h2>{item.word}</h2>
                  </div>

                  {/* 버튼 */}

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
                        isFavorite(item.id) ? "즐겨찾기 해제" : "즐겨찾기 추가"
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

      {/* =========================
          페이지네이션
      ========================= */}

      {result.length > 0 && totalPages > 1 && (
        <nav className="pagination" aria-label="신조어 페이지 이동">
          {/* 이전 페이지 그룹 */}

          <button
            type="button"
            className="pagination-button group-button"
            onClick={goPreviousGroup}
            disabled={currentPageGroup === 1}
            aria-label="이전 페이지 그룹"
            title="이전 페이지 그룹"
          >
            {"<<"}
          </button>

          {/* 이전 페이지 */}

          <button
            type="button"
            className="pagination-button"
            onClick={goPreviousPage}
            disabled={currentPage === 1}
            aria-label="이전 페이지"
            title="이전 페이지"
          >
            {"<"}
          </button>

          {/* 페이지 번호 */}

          <div className="pagination-numbers">
            {pageNumbers.map((page) => (
              <button
                key={page}
                type="button"
                className={
                  currentPage === page
                    ? "pagination-number active"
                    : "pagination-number"
                }
                onClick={() => goToPage(page)}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            ))}
          </div>

          {/* 다음 페이지 */}

          <button
            type="button"
            className="pagination-button"
            onClick={goNextPage}
            disabled={currentPage === totalPages}
            aria-label="다음 페이지"
            title="다음 페이지"
          >
            {">"}
          </button>

          {/* 다음 페이지 그룹 */}

          <button
            type="button"
            className="pagination-button group-button"
            onClick={goNextGroup}
            disabled={currentPageGroup * PAGE_GROUP_SIZE >= totalPages}
            aria-label="다음 페이지 그룹"
            title="다음 페이지 그룹"
          >
            {">>"}
          </button>
        </nav>
      )}
    </div>
  );
}

export default Dictionary;
