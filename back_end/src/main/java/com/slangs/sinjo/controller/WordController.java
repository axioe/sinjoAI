package com.slangs.sinjo.controller;

import com.slangs.sinjo.dto.WordResponse;
import com.slangs.sinjo.service.WordService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/words")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class WordController {

    private final WordService wordService;


    /**
     * 전체 신조어
     * <p>
     * GET /api/words
     */
    @GetMapping
    public List<WordResponse> getWords() {

        return wordService.getAllWords();
    }


    /**
     * 특정 신조어
     * <p>
     * GET /api/words/{id}
     */
    @GetMapping("/{id}")
    public WordResponse getWord(
            @PathVariable Long id
    ) {

        return wordService.getWord(id);
    }


    /**
     * 좋아요
     * <p>
     * POST /api/words/{id}/like
     */
    @PostMapping("/{id}/like")
    public WordResponse likeWord(
            @PathVariable Long id
    ) {

        return wordService.likeWord(id);
    }


    /**
     * 인기 신조어 TOP 5
     * <p>
     * GET /api/words/trending
     */
    @GetMapping("/trending")
    public List<WordResponse> getTrendingWords() {

        return wordService.getTrendingWords();
    }
}