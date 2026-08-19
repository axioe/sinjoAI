package com.slangs.sinjo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "words")
@Getter
@NoArgsConstructor
public class Word {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String word;

    @Column(nullable = false, length = 500)
    private String meaning;

    @Column(nullable = false, length = 500)
    private String example;

    @Column(nullable = false)
    private Long likes = 0L;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(nullable = true, length = 20)
    private String era;

    public Word(
            String word,
            String meaning,
            String example,
            String category,
            String era
    ) {
        this.word = word;
        this.meaning = meaning;
        this.example = example;
        this.likes = 0L;
        this.category = category;
        this.era = era;
    }

    /**
     * 기존 3개 인자를 사용하는 코드가 있다면
     * 기본 카테고리는 기타로 처리한다.
     */
    public Word(
            String word,
            String meaning,
            String example
    ) {
        this(
                word,
                meaning,
                example,
                "기타",
                null
        );
    }

    /**
     * 관리자 화면에서 용어를 수정할 때 쓴다.
     */
    public void update(
            String word,
            String meaning,
            String example,
            String category,
            String era
    ) {
        this.word = word;
        this.meaning = meaning;
        this.example = example;
        this.category = category;
        this.era = era;
    }

    public void increaseLike() {
        this.likes++;
    }
}
