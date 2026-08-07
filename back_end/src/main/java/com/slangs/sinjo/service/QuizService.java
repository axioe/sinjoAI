package com.slangs.sinjo.service;

import com.slangs.sinjo.dto.QuizDto;
import com.slangs.sinjo.entity.QuizWord;
import com.slangs.sinjo.repository.QuizRepository;
import com.slangs.sinjo.util.KoreanUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class QuizService {

    private final QuizRepository quizRepository;
    private static final int DEFAULT_QUIZ_COUNT = 5;

    // 1. 객관식 퀴즈 목록 생성
    public List<QuizDto.MultipleChoice> getMultipleChoiceQuizzes() {
        List<QuizWord> randomWords = quizRepository.findRandomQuizzes(DEFAULT_QUIZ_COUNT);

        return randomWords.stream().map(quiz -> {
            // 정답 1개 + 오답 보기 3개를 합쳐 4개의 선택지 구성
            List<String> options = new ArrayList<>(quiz.getOptions());
            options.add(quiz.getAnswer());
            Collections.shuffle(options); // 보기 순서 랜덤 섞기

            return new QuizDto.MultipleChoice(
                    quiz.getId(),
                    quiz.getWord(),
                    options,
                    quiz.getDescription()
            );
        }).toList();
    }

    // 2. 초성 퀴즈 목록 생성
    public List<QuizDto.InitialSound> getInitialSoundQuizzes() {
        List<QuizWord> randomWords = quizRepository.findRandomQuizzes(DEFAULT_QUIZ_COUNT);

        return randomWords.stream().map(quiz -> {
            String initialSound = KoreanUtils.extractInitialSound(quiz.getWord());
            return new QuizDto.InitialSound(
                    quiz.getId(),
                    initialSound,
                    quiz.getDescription() // 뜻이나 예문 등을 힌트로 활용
            );
        }).toList();
    }

    // 3. 주관식 퀴즈 목록 생성
    public List<QuizDto.Subjective> getSubjectiveQuizzes() {
        List<QuizWord> randomWords = quizRepository.findRandomQuizzes(DEFAULT_QUIZ_COUNT);

        return randomWords.stream().map(quiz -> new QuizDto.Subjective(
                quiz.getId(),
                "다음 뜻에 해당하는 신조어는?: " + quiz.getAnswer(),
                quiz.getDescription()
        )).toList();
    }

    // 4. 정답 확인 및 채점
    public QuizDto.CheckResponse checkAnswer(QuizDto.CheckRequest request) {
        QuizWord quiz = quizRepository.findById(request.quizId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 퀴즈 ID입니다: " + request.quizId()));

        String submittedAnswer = request.answer().trim().replaceAll("\\s+", ""); // 공백 제거
        String correctAnswer = quiz.getAnswer().trim().replaceAll("\\s+", "");
        String correctWord = quiz.getWord().trim().replaceAll("\\s+", "");

        // 사용자가 제출한 값이 정답(뜻) 혹은 신조어(단어)와 일치하는지 판별
        boolean isCorrect = submittedAnswer.equalsIgnoreCase(correctAnswer)
                || submittedAnswer.equalsIgnoreCase(correctWord);

        return new QuizDto.CheckResponse(isCorrect, quiz.getWord() + " (" + quiz.getAnswer() + ")");
    }
}