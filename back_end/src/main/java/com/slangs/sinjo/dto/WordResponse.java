package com.slangs.sinjo.dto;

import com.slangs.sinjo.entity.Word;
import lombok.Getter;

@Getter
public class WordResponse {

    private Long id;

    private String word;

    private String meaning;

    private String example;

    private Long likes;

    private Integer rank;


    public WordResponse(Word word) {
        this.id = word.getId();
        this.word = word.getWord();
        this.meaning = word.getMeaning();
        this.example = word.getExample();
        this.likes = word.getLikes();
    }


    public WordResponse(
            Word word,
            Integer rank
    ) {
        this.id = word.getId();
        this.word = word.getWord();
        this.meaning = word.getMeaning();
        this.example = word.getExample();
        this.likes = word.getLikes();
        this.rank = rank;
    }
}
