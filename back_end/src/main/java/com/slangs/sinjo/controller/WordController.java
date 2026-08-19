package com.slangs.sinjo.controller;

import com.slangs.sinjo.dto.WordDto;
import com.slangs.sinjo.service.WordService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/words")
@RequiredArgsConstructor
public class WordController {

    private final WordService wordService;

    @GetMapping("/ranking")
    public List<WordDto> getRankingWords() {
        return wordService.getRankingWords();
    }

    @GetMapping
    public List<WordDto> getWords() {
        return wordService.getAllWords();
    }

    @GetMapping("/{id}")
    public WordDto getWord(
            @PathVariable Long id
    ) {
        return wordService.getWord(id);
    }

    @PostMapping("/{id}/like")
    public WordDto likeWord(
            @PathVariable Long id
    ) {
        return wordService.likeWord(id);
    }
}
