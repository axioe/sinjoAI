package com.slangs.sinjo.repository;

import com.slangs.sinjo.entity.Word;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WordRepository
        extends JpaRepository<Word, Long> {

    List<Word> findTop5ByOrderByLikesDesc();
}