package com.slangs.sinjo.repository;


import com.slangs.sinjo.entity.QuizWord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuizRepository extends JpaRepository<QuizWord, Long> {

    // N개의 랜덤 데이터 가져오기 (MySQL/H2 기준)
    @Query(value = "SELECT * FROM quiz_word ORDER BY RAND() LIMIT :count", nativeQuery = true)
    List<QuizWord> findRandomQuizzes(@Param("count") int count);
}