package com.slangs.sinjo.controller;

import com.slangs.sinjo.dto.WordAnswer;
import com.slangs.sinjo.dto.WordDto;
import com.slangs.sinjo.dto.WordSearchResponse;
import com.slangs.sinjo.dto.WordRequest;
import com.slangs.sinjo.entity.Word;
import com.slangs.sinjo.service.WordIndexService;
import com.slangs.sinjo.service.WordRagService;
import com.slangs.sinjo.service.WordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * [수정] @CrossOrigin(origins = "http://localhost:5173") 을 제거했다.
 *
 * 두 가지 문제가 있었다.
 *  1) 포트가 틀렸다. vite.config.js 의 개발 서버 포트는 5555 다.
 *  2) SecurityConfig 에 전역 CORS 설정이 이미 있는데 여기에 또 걸면 설정이 두 겹이 된다.
 *     지금은 시큐리티의 CorsFilter 가 먼저 헤더를 붙여서 이 애노테이션이 조용히 무시되지만,
 *     나중에 누군가 시큐리티 CORS 를 손대는 순간 갑자기 5173 만 허용되는 상태로 바뀐다.
 *     허용 주소는 application.yaml 의 app.cors.allowed-origins 한 곳에서만 관리한다.
 */
@RestController
@RequestMapping("/api/words")
@RequiredArgsConstructor
public class WordController {

    private final WordService wordService;

    private final WordRagService wordRagService;
    private final WordIndexService wordIndexService;
    /**
     * 인기 신조어 TOP 5
     * <p>
     * GET /api/words/ranking
     *
     * [주의] 이 메서드는 반드시 getWord(@PathVariable id) 보다 위에 두는 것이 안전하다.
     * 스프링은 고정 경로("/ranking")를 변수 경로("/{id}")보다 우선하므로 지금도 동작하지만,
     * 읽는 사람이 헷갈리지 않도록 순서를 맞춰 둔다.
     */
    @GetMapping("/ranking")
    public List<WordDto> getRankingWords() {

        return wordService.getRankingWords();
    }


    /**
     * 전체 신조어
     * <p>
     * GET /api/words
     */
    @GetMapping
    public List<WordDto> getWords() {

        return wordService.getAllWords();
    }


    /**
     * 특정 신조어
     * <p>
     * GET /api/words/{id}
     */
    @GetMapping("/{id}")
    public WordDto getWord(
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
    public WordDto likeWord(
            @PathVariable Long id
    ) {

        return wordService.likeWord(id);
    }

    @PostMapping
    public WordDto create(
            @RequestBody WordRequest request
    ) {
        return wordService.create(request);
    }

    @PutMapping("/{id}")
    public WordDto update(
            @PathVariable Long id,
            @RequestBody WordRequest request
    ) {
        return wordService.update(
                id,
                request
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id
    ) {
        wordService.delete(id);

        return ResponseEntity.noContent()
                .build();
    }

    @GetMapping("/ask")
    public WordAnswer ask(@RequestParam String question) {
        return wordRagService.ask(question);
    }

    @PostMapping("/index")
    public void index() {
        wordIndexService.indexAll();
    }

    @GetMapping("/search")
    public WordSearchResponse search(@RequestParam String question) {
        return wordRagService.search(question);
    }
}
