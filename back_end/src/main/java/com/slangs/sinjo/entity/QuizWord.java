package com.slangs.sinjo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
public class QuizWord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String word; // 신조어 (예: "억까")

    @Column(nullable = false)
    private String answer; // 뜻/풀이 (예: "억지로 까기")

    @ElementCollection
    private List<String> options = new ArrayList<>(); // 객관식용 오답 보기 리스트

    private String description; // 힌트 또는 예문

    public QuizWord(String word, String answer, List<String> options, String description) {
        this.word = word;
        this.answer = answer;
        this.options = options;
        this.description = description;
    }
}