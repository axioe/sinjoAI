package com.slangs.sinjo.repository;

import com.slangs.sinjo.entity.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WordRepository
        extends JpaRepository<Word, Long> {

    /**
     * [수정] 정렬 기준에 id 를 추가했다.
     *
     * 좋아요 수가 같은 단어가 여러 개일 때(초기에는 전부 0 이다)
     * likes 만으로 정렬하면 DB 가 매번 다른 순서를 돌려준다.
     * 새로고침할 때마다 랭킹 순위가 바뀌면 버그로 오해받는다.
     */
    List<Word> findTop5ByOrderByLikesDescIdAsc();

    /** 관리자 등록 시 중복 확인용. word 컬럼에 unique 제약이 걸려 있다. */
    boolean existsByWord(String word);

    /** 수정 시 자기 자신은 중복에서 제외한다. */
    boolean existsByWordAndIdNot(String word, Long id);

    /** 관리자 목록: 최근 등록순 */
    List<Word> findAllByOrderByIdDesc();

    /**
     * [추가] 좋아요를 DB 에서 직접 1 증가시킨다.
     *
     * 기존 방식(엔티티를 읽어 likes++ 후 저장)은 두 사람이 동시에 누르면
     * 둘 다 100 을 읽고 둘 다 101 을 써서 한 번이 사라진다(lost update).
     * UPDATE ... SET likes = likes + 1 은 DB 가 원자적으로 처리한다.
     */
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Word w SET w.likes = w.likes + 1 WHERE w.id = :id")
    int increaseLike(@Param("id") Long id);
}
