package com.slangs.sinjo.service;

import com.slangs.sinjo.dto.WordDto;
import com.slangs.sinjo.entity.Word;
import com.slangs.sinjo.exception.NotFoundException;
import com.slangs.sinjo.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class WordService {

    private final WordRepository wordRepository;

    /**
     * 전체 신조어 조회
     */
    @Transactional(readOnly = true)
    public List<WordDto> getAllWords() {

        return wordRepository.findAll()
                .stream()
                .map(WordDto::new)
                .toList();
    }

    /**
     * 특정 신조어 조회
     * <p>
     * 상세 페이지에 들어갈 때마다 조회수 +1
     */
    @Transactional
    public WordDto getWord(Long id) {

        Word word = findWordOrThrow(id);

        int updated = wordRepository.increaseView(id);

        if (updated == 0) {
            throw new NotFoundException(
                    "신조어를 찾을 수 없습니다."
            );
        }

        /**
         * 조회수가 증가한 최신 데이터를 다시 가져온다.
         */
        Word updatedWord = findWordOrThrow(id);

        return new WordDto(updatedWord);
    }

    /**
     * 좋아요 증가
     */
    @Transactional
    public WordDto likeWord(Long id) {

        int updated = wordRepository.increaseLike(id);

        if (updated == 0) {
            throw new IllegalArgumentException(
                    "신조어를 찾을 수 없습니다."
            );
        }

        return new WordDto(findWordOrThrow(id));
    }

    /**
     * 좋아요 기준 TOP 5
     */
    @Transactional(readOnly = true)
    public List<WordDto> getRankingWords() {

        List<Word> words =
                wordRepository.findTop5ByOrderByLikesDescIdAsc();

        return IntStream
                .range(0, words.size())
                .mapToObj(index ->
                        new WordDto(
                                words.get(index),
                                index + 1
                        )
                )
                .toList();
    }

    private Word findWordOrThrow(Long id) {

        return wordRepository.findById(id)
                .orElseThrow(() ->
                        new NotFoundException(
                                "신조어를 찾을 수 없습니다."
                        )
                );
    }
}
