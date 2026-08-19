package com.slangs.sinjo.service;

import com.slangs.sinjo.document.WordDocumentConverter;
import com.slangs.sinjo.dto.WordDto;
import com.slangs.sinjo.dto.WordRequest;
import com.slangs.sinjo.entity.Word;
import com.slangs.sinjo.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.ai.vectorstore.filter.FilterExpressionBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class WordService {

    private final WordRepository wordRepository;
    private final VectorStore vectorStore;
    private final WordDocumentConverter documentConverter;

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
     */
    @Transactional(readOnly = true)
    public WordDto getWord(Long id) {

        return new WordDto(findWordOrThrow(id));
    }


    /**
     * 좋아요 증가
     *
     * [수정] DB 에서 직접 증가시킨 뒤 다시 읽어 반환한다.
     * 기존 코드는 엔티티를 읽어 자바에서 +1 했기 때문에
     * 두 사람이 동시에 누르면 한 번이 유실됐다.
     */
    @Transactional
    public WordDto likeWord(Long id) {

        int updated = wordRepository.increaseLike(id);

        if (updated == 0) {
            throw new IllegalArgumentException("신조어를 찾을 수 없습니다.");
        }

        return new WordDto(findWordOrThrow(id));
    }


    /**
     * 좋아요 기준 TOP 5
     */
    @Transactional(readOnly = true)
    public List<WordDto> getRankingWords() {

        List<Word> words = wordRepository.findTop5ByOrderByLikesDescIdAsc();

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
                        new IllegalArgumentException(
                                "신조어를 찾을 수 없습니다."
                        )
                );
    }

    @Transactional
    public WordDto create(WordRequest request) {

        Word word = new Word(
                request.word(),
                request.category(),
                request.meaning(),
                request.example()
        );

        Word savedWord =
                wordRepository.save(word);

        Document document =
                documentConverter.convert(savedWord);

        vectorStore.add(
                List.of(document)
        );

        return new WordDto(savedWord);
    }

    @Transactional
    public void delete(Long wordId) {

        Word word = wordRepository.findById(wordId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Word not found: " + wordId
                        )
                );

        wordRepository.delete(word);

        deleteVector(wordId);
    }

    private void deleteVector(Long wordId){
        FilterExpressionBuilder builder = new FilterExpressionBuilder();

        vectorStore.delete(
                builder
                        .eq("wordId", String.valueOf(wordId))
                        .build()
        );
    }


    @Transactional
    public WordDto update(Long wordId, WordRequest request) {

        // 1. 기존 Word 조회
        Word word = wordRepository.findById(wordId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Word not found: " + wordId
                        )
                );

        // 2. 원본 데이터 수정
        word.update(
                request.word(),
                request.category(),
                request.meaning(),
                request.example()
        );

        Word updatedWord = wordRepository.save(word);

        // 기존 Vector 삭제
        deleteVector(wordId);

        // 4. 수정된 Word로 새로운 Document 생성
        Document document =documentConverter.convert(updatedWord);

        // 5. 새로운 embedding 생성 + PGVector 저장
        vectorStore.add(List.of(document)
        );

        return new WordDto(updatedWord);
    }
}
