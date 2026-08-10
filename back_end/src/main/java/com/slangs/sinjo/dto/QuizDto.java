package com.slangs.sinjo.dto;

import java.util.List;

public class QuizDto {

    /** 객관식. 정답은 내려주지 않는다(브라우저에서 들여다볼 수 있으므로). */
    public record MultipleChoice(
            Long id,
            String word,
            List<String> options,
            String description
    ) {}

    public record InitialSound(
            Long id,
            String initialSound,
            String hint
    ) {}

    public record Subjective(
            Long id,
            String question,
            String description
    ) {}

    public record CheckRequest(
            Long quizId,
            String answer
    ) {}

    /**
     * 채점 결과.
     * correct 로 이름을 바꾼 이유는, isCorrect 로 두면 JSON 직렬화 규칙에 따라
     * 프론트에서 받는 키 이름이 달라질 수 있어서다. 이름을 맞춰 혼란을 없앤다.
     * correctAnswer 는 오답일 때 화면에 정답을 보여주기 위해 함께 내려준다.
     */
    public record CheckResponse(
            boolean correct,
            String correctAnswer
    ) {}
}
