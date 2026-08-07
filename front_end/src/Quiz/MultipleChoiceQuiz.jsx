import React, { useState, useEffect } from 'react';

export default function MultipleChoiceQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    fetch('/api/quiz/multiple-choice')
      .then((res) => res.json())
      .then((data) => setQuizzes(data));
  }, []);

  const handleNext = async () => {
    if (!selected) return;

    const res = await fetch('/api/quiz/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quizId: quizzes[currentIndex].id,
        answer: selected,
      }),
    });
    const result = await res.json();
    if (result.isCorrect) setScore((prev) => prev + 1);

    if (currentIndex + 1 < quizzes.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelected('');
    } else {
      setIsFinished(true);
    }
  };

  if (!quizzes.length) return <div className="text-center p-8">로딩 중...</div>;
  if (isFinished) return <div className="text-center p-8 bg-white rounded-xl shadow p-6">완료! 점수: {score} / {quizzes.length}</div>;

  const current = quizzes[currentIndex];

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-lg font-bold text-indigo-600 mb-2">객관식 퀴즈</h2>
      <h3 className="text-xl font-bold mb-4">'{current.word}'의 알맞은 뜻은?</h3>

      <div className="space-y-3 mb-6">
        {current.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(option)}
            className={`w-full p-3 text-left rounded-lg border transition ${
              selected === option
                ? 'border-indigo-600 bg-indigo-50 font-semibold text-indigo-700'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            {idx + 1}. {option}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={!selected}
        className="w-full py-3 bg-indigo-600 text-white rounded-lg disabled:opacity-50 font-semibold"
      >
        {currentIndex + 1 === quizzes.length ? '결과 보기' : '다음 문제'}
      </button>
    </div>
  );
}