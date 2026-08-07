package com.slangs.sinjo.dto;

import java.util.List;

public class QuizDto {

    // 1. 객관식 DTO
    public record MultipleChoice(
            Long id,
            String word,          // 신조어 (예: "억까")
            List<String> options, // 보기 4개
            String description    // 힌트/설명
    ) {}

    // 2. 초성 퀴즈 DTO
    public record InitialSound(
            Long id,
            String initialSound,  // 초성 (예: "ㅇㄲ")
            String hint           // 힌트/뜻 설명
    ) {}

    // 3. 주관식 DTO
    public record Subjective(
            Long id,
            String question,      // 질문/설명 (예: "억지로 깐다는 뜻의 신조어는?")
            String description    // 추가 힌트
    ) {}

    // 정답 확인 요청 DTO
    public record CheckRequest(
            Long quizId,
            String answer
    ) {}

    // 정답 확인 응답 DTO
    public record CheckResponse(
            boolean isCorrect,
            String correctAnswer
    ) {}
}