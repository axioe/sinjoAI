import React, { useState, useEffect } from 'react';

export default function InitialSoundQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    fetch('/api/quiz/initial-sound')
      .then((res) => res.json())
      .then((data) => setQuizzes(data));
  }, []);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const res = await fetch('/api/quiz/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quizId: quizzes[currentIndex].id,
        answer: input.trim(),
      }),
    });
    const result = await res.json();
    if (result.isCorrect) setScore((prev) => prev + 1);

    if (currentIndex + 1 < quizzes.length) {
      setCurrentIndex((prev) => prev + 1);
      setInput('');
    } else {
      setIsFinished(true);
    }
  };

  if (!quizzes.length) return <div className="text-center p-8">로딩 중...</div>;
  if (isFinished) return <div className="text-center p-8 bg-white rounded-xl shadow p-6">완료! 점수: {score} / {quizzes.length}</div>;

  const current = quizzes[currentIndex];

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-lg font-bold text-emerald-600 mb-2">초성 퀴즈</h2>
      <div className="p-4 bg-gray-100 rounded-lg text-center text-3xl font-black text-emerald-600 mb-4 tracking-widest">
        {current.initialSound}
      </div>

      {current.hint && <p className="text-sm text-gray-500 mb-4">💡 힌트: {current.hint}</p>}

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="단어를 입력하세요"
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-emerald-500 outline-none"
      />

      <button
        onClick={handleSubmit}
        disabled={!input.trim()}
        className="w-full py-3 bg-emerald-600 text-white rounded-lg disabled:opacity-50 font-semibold"
      >
        {currentIndex + 1 === quizzes.length ? '결과 보기' : '다음 문제'}
      </button>
    </div>
  );
}