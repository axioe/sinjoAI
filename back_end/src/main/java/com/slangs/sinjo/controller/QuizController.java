package com.slangs.sinjo.controller;



import com.slangs.sinjo.dto.QuizDto;
import com.slangs.sinjo.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    // 객관식 문제 목록 API
    @GetMapping("/multiple-choice")
    public ResponseEntity<List<QuizDto.MultipleChoice>> getMultipleChoiceQuizzes() {
        return ResponseEntity.ok(quizService.getMultipleChoiceQuizzes());
    }

    // 초성 퀴즈 문제 목록 API
    @GetMapping("/initial-sound")
    public ResponseEntity<List<QuizDto.InitialSound>> getInitialSoundQuizzes() {
        return ResponseEntity.ok(quizService.getInitialSoundQuizzes());
    }

    // 주관식 문제 목록 API
    @GetMapping("/subjective")
    public ResponseEntity<List<QuizDto.Subjective>> getSubjectiveQuizzes() {
        return ResponseEntity.ok(quizService.getSubjectiveQuizzes());
    }

    // 공통 정답 채점 API
    @PostMapping("/check")
    public ResponseEntity<QuizDto.CheckResponse> checkAnswer(@RequestBody QuizDto.CheckRequest request) {
        return ResponseEntity.ok(quizService.checkAnswer(request));
    }
}