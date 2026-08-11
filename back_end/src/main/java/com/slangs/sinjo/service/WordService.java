package com.slangs.sinjo.service;

import com.slangs.sinjo.dto.WordResponse;
import com.slangs.sinjo.entity.Word;
import com.slangs.sinjo.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WordService {

    private final WordRepository wordRepository;


    /**
     * 전체 신조어 조회
     */
    @Transactional(readOnly = true)
    public List<WordResponse> getAllWords() {

        return wordRepository.findAll()
                .stream()
                .map(WordResponse::new)
                .toList();
    }


    /**
     * 특정 신조어 조회
     */
    @Transactional(readOnly = true)
    public WordResponse getWord(Long id) {

        Word word = wordRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "신조어를 찾을 수 없습니다."
                        )
                );

        return new WordResponse(word);
    }


    /**
     * 좋아요 증가
     */
    @Transactional
    public WordResponse likeWord(Long id) {

        Word word = wordRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "신조어를 찾을 수 없습니다."
                        )
                );

        word.increaseLike();

        return new WordResponse(word);
    }


    /**
     * 좋아요 기준 TOP 5
     */
    @Transactional(readOnly = true)
    public List<WordResponse> getRankingWords() {

        List<Word> words =
                wordRepository.findTop5ByOrderByLikesDesc();

        return java.util.stream.IntStream
                .range(0, words.size())
                .mapToObj(index ->
                        new WordResponse(
                                words.get(index),
                                index + 1
                        )
                )
                .toList();
    }
}
