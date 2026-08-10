import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSubjectiveQuiz, checkAnswer } from "../api/quizApi";
import QuizResult from "./QuizResult";
import QuizProgress from "./QuizProgress";
import "../css/Game.css";

function SubjectiveQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    getSubjectiveQuiz().then(setQuizzes);
  }, []);

  const current = quizzes[index];

  const handleSubmit = async () => {
    if (!input.trim()) return;
    const correct = await checkAnswer(current, input.trim());
    setFeedback(correct);
    if (correct) setScore((prev) => prev + 1);
  };

  const handleNext = () => {
    if (index + 1 < quizzes.length) {
      setIndex((prev) => prev + 1);
      setInput("");
      setFeedback(null);
    } else {
      setFinished(true);
    }
  };

  const handleRetry = () => {
    setIndex(0);
    setInput("");
    setFeedback(null);
    setScore(0);
    setFinished(false);
  };

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;
    if (feedback === null) handleSubmit();
    else handleNext();
  };

  if (!quizzes.length) return <div className="quiz-loading">문제를 불러오는 중...</div>;
  if (finished) return <QuizResult score={score} total={quizzes.length} onRetry={handleRetry} />;

  return (
    <div className="quiz-page">
      <Link to="/game" className="quiz-back">← 게임 선택으로</Link>

      <div className="quiz-card">
        <p className="quiz-label">주관식 퀴즈</p>
        <QuizProgress index={index} total={quizzes.length} />

        <h2 className="quiz-question">{current.question}</h2>

        {current.description && <p className="quiz-hint">💡 힌트: {current.description}</p>}

        <input
          className="quiz-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="신조어를 입력하세요"
          disabled={feedback !== null}
        />

        {feedback !== null && (
          <div className={`quiz-feedback ${feedback ? "correct" : "wrong"}`}>
            {feedback ? "정답입니다!" : `아쉬워요. 정답은 '${current.answer}' 입니다.`}
          </div>
        )}

        {feedback === null ? (
          <button type="button" className="quiz-submit" onClick={handleSubmit} disabled={!input.trim()}>
            정답 확인
          </button>
        ) : (
          <button type="button" className="quiz-submit" onClick={handleNext}>
            {index + 1 === quizzes.length ? "결과 보기" : "다음 문제"}
          </button>
        )}
      </div>
    </div>
  );
}

export default SubjectiveQuiz;
