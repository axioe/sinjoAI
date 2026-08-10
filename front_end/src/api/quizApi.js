import {
  MULTIPLE_CHOICE_SAMPLE,
  INITIAL_SOUND_SAMPLE,
  SUBJECTIVE_SAMPLE,
} from "../data/quizSampleData";

const BASE_URL = "http://localhost:8080/api/quiz";

/** 서버가 없거나 꺼져 있으면 샘플 데이터로 대체한다. */
async function fetchQuizzes(path, fallback) {
  try {
    const res = await fetch(`${BASE_URL}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn(`[quizApi] 서버 응답 없음 (${path}). 샘플 데이터를 사용합니다.`, error);
    return fallback;
  }
}

export const getMultipleChoiceQuiz = () => fetchQuizzes("/multiple-choice", MULTIPLE_CHOICE_SAMPLE);
export const getInitialSoundQuiz = () => fetchQuizzes("/initial-sound", INITIAL_SOUND_SAMPLE);
export const getSubjectiveQuiz = () => fetchQuizzes("/subjective", SUBJECTIVE_SAMPLE);

/**
 * 정답 확인. 서버가 없으면 문제에 든 answer 와 직접 비교한다.
 * 공백을 지우고 비교해 "혼 밥" 처럼 띄어 쓴 답도 정답으로 처리한다.
 */
export async function checkAnswer(quiz, answer) {
  try {
    const res = await fetch(`${BASE_URL}/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizId: quiz.id, answer }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const result = await res.json();
    return result.isCorrect;
  } catch {
    const normalize = (v) => String(v).replace(/\s/g, "").toLowerCase();
    return normalize(quiz.answer) === normalize(answer);
  }
}
