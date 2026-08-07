import React, { useState } from 'react';
import MultipleChoiceQuiz from './MultipleChoiceQuiz';
import InitialSoundQuiz from './InitialSoundQuiz';
import SubjectiveQuiz from './SubjectiveQuiz';

export default function QuizMain() {
  const [mode, setMode] = useState(null); // 'MULTIPLE' | 'INITIAL' | 'SUBJECTIVE' | null

  if (!mode) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">신조어 퀴즈 게임</h1>
        <div className="space-y-4">
          <button
            onClick={() => setMode('MULTIPLE')}
            className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            1. 객관식 퀴즈 (뜻 맞추기)
          </button>
          <button
            onClick={() => setMode('INITIAL')}
            className="w-full py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition"
          >
            2. 초성 퀴즈 (단어 맞추기)
          </button>
          <button
            onClick={() => setMode('SUBJECTIVE')}
            className="w-full py-4 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition"
          >
            3. 주관식 퀴즈 (신조어 쓰기)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <button
        onClick={() => setMode(null)}
        className="mb-4 text-sm text-gray-500 hover:underline font-medium"
      >
        ← 메인으로 돌아가기
      </button>

      {mode === 'MULTIPLE' && <MultipleChoiceQuiz />}
      {mode === 'INITIAL' && <InitialSoundQuiz />}
      {mode === 'SUBJECTIVE' && <SubjectiveQuiz />}
    </div>
  );
}