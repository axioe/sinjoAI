import { request } from "./client";

/**
 * [수정] 존재하지 않는 주소를 부르고 있었다.
 *
 * 기존: getRank() → GET /api/rank   (서버에 없는 주소. 404)
 *       getTodayWord() → GET /api/today (없는 주소)
 *       getQuiz() → GET /api/quiz       (없는 주소. /api/quiz/multiple-choice 등만 있다)
 *
 * 지금은 아무 화면도 이 파일을 쓰지 않아 증상이 없지만,
 * 나중에 누군가 그대로 가져다 쓰면 원인을 찾느라 시간을 버린다.
 * 실제 서버 주소에 맞추고, axios 대신 공통 request 를 쓰도록 통일했다.
 */

/** 좋아요 기준 인기 신조어 TOP 5 */
export const getRankingWords = () => request("/api/words/ranking");

/** 신조어 전체 목록 */
export const getWords = () => request("/api/words");

/** 신조어 한 건 */
export const getWord = (id) => request(`/api/words/${id}`);

/** 좋아요 누르기 */
export const likeWord = (id) => request(`/api/words/${id}/like`, { method: "POST" });
