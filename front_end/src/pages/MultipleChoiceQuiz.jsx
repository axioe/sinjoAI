import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMultipleChoiceQuiz, checkAnswer } from "../api/quizApi";
import QuizResult from "./QuizResult";
import QuizProgress from "./QuizProgress";
import "../css/Game.css";

function MultipleChoiceQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [feedback, setFeedback] = useState(null); // null | { correct, correctAnswer }
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    getMultipleChoiceQuiz().then(setQuizzes);
  }, []);

  const current = quizzes[index];

  const handleSubmit = async () => {
    if (!selected) return;
    const result = await checkAnswer(current, selected);
    setFeedback(result);
    if (result.correct) setScore((prev) => prev + 1);
  };

  const handleNext = () => {
    if (index + 1 < quizzes.length) {
      setIndex((prev) => prev + 1);
      setSelected("");
      setFeedback(null);
    } else {
      setFinished(true);
    }
  };

  const handleRetry = () => {
    setIndex(0);
    setSelected("");
    setFeedback(null);
    setScore(0);
    setFinished(false);
  };

  if (!quizzes.length) return <div className="quiz-loading">문제를 불러오는 중...</div>;
  if (finished) return <QuizResult score={score} total={quizzes.length} onRetry={handleRetry} />;

  return (
    <div className="quiz-page">
      <Link to="/game" className="quiz-back">← 게임 선택으로</Link>

      <div className="quiz-card">
        <p className="quiz-label">객관식 퀴즈</p>
        <QuizProgress index={index} total={quizzes.length} />

        <h2 className="quiz-question">'{current.word}' 의 알맞은 뜻은?</h2>

        <div className="quiz-options">
          {current.options.map((option) => (
            <button
              key={option}
              type="button"
              className={`quiz-option ${selected === option ? "selected" : ""}`}
              onClick={() => setSelected(option)}
              disabled={feedback !== null}
            >
              {option}
            </button>
          ))}
        </div>

        {feedback !== null && (
          <div className={`quiz-feedback ${feedback.correct ? "correct" : "wrong"}`}>
            {feedback.correct
              ? "정답입니다!"
              : `아쉬워요. 정답은 '${feedback.correctAnswer}' 입니다.`}
          </div>
        )}

        {feedback === null ? (
          <button type="button" className="quiz-submit" onClick={handleSubmit} disabled={!selected}>
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

export default MultipleChoiceQuiz;
