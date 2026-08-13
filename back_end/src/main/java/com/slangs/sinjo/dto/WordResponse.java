package com.slangs.sinjo.dto;

import com.slangs.sinjo.entity.Word;
import lombok.Getter;

/**
 * 신조어 응답 양식.
 *
 * 생성자가 두 개인 이유:
 *  - 사전·관리자 화면은 순위가 필요 없다 → rank 없이
 *  - 랭킹 화면은 순위를 함께 보여준다 → rank 포함
 * rank 를 안 넣으면 JSON 에 null 로 나가고 화면에서는 그냥 안 쓰면 된다.
 */
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