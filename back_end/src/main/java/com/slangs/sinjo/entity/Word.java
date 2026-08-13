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

    @Column(length = 100)
    private String category;

    public Word(
            String word,
            String meaning,
            String example
    ) {
        this.word = word;
        this.meaning = meaning;
        this.example = example;
        this.likes = 0L;
    }


    /** 관리자 화면에서 용어를 수정할 때 쓴다. */
    public void update(String word, String meaning, String example) {
        this.word = word;
        this.meaning = meaning;
        this.example = example;
    }

    public void increaseLike() {
        this.likes++;
    }
}
