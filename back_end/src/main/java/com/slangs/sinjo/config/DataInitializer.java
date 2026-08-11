package com.slangs.sinjo.config;

import com.slangs.sinjo.entity.QuizWord;
import com.slangs.sinjo.entity.Word;
import com.slangs.sinjo.repository.QuizRepository;
import com.slangs.sinjo.repository.WordRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

/**
 * [신규] 초기 데이터 주입.
 *
 * 왜 필요한가:
 *  - words 테이블이 비어 있으면 /api/words 가 [] 를 돌려주고,
 *    사전 · 랭킹 · 오늘의 신조어 세 화면이 전부 빈 화면이 된다.
 *  - quiz_word 테이블이 비어 있으면 게임 3종이 전부 샘플 데이터로만 돌아간다.
 *  → 지금 상태로는 서버를 켜도 시연할 것이 없다.
 *
 * 이미 데이터가 있으면 아무것도 하지 않으므로, 팀원이 직접 넣은 데이터를 덮어쓰지 않는다.
 * 실제 수집 파이프라인이 붙으면 이 파일을 지우면 된다.
 */
@Slf4j
@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner seedData(WordRepository wordRepository,
                                      QuizRepository quizRepository) {
        return args -> {
            seedWords(wordRepository);
            seedQuizWords(quizRepository);
        };
    }

    private void seedWords(WordRepository wordRepository) {
        if (wordRepository.count() > 0) {
            return;
        }

        wordRepository.saveAll(List.of(
                new Word("억까", "억지로 까다. 이유 없이 비판하거나 공격하는 상황",
                        "내가 잘못한 것도 없는데 억까 당했어."),
                new Word("갓생", "신(God) + 인생. 부지런하고 계획적인 삶",
                        "요즘 운동하면서 갓생 살고 있어."),
                new Word("킹받네", "열받네를 강조한 표현",
                        "진짜 너무 킹받네."),
                new Word("알잘딱깔센", "알아서 잘 딱 깔끔하고 센스있게",
                        "이번 일은 알잘딱깔센하게 부탁해."),
                new Word("중꺾마", "중요한 것은 꺾이지 않는 마음",
                        "힘들어도 중꺾마 정신으로 도전한다."),
                new Word("스불재", "스스로 불러온 재앙",
                        "밤새 게임한 건 내 스불재다."),
                new Word("혼밥", "혼자 밥을 먹는 것",
                        "오늘 점심은 그냥 혼밥했어."),
                new Word("럭키비키", "운이 좋아 일이 잘 풀리는 상황을 뜻하는 말",
                        "버스 오자마자 탔네, 완전 럭키비키잖아."),
                new Word("현타", "현실 자각 타임. 들뜬 뒤 갑자기 현실을 깨닫는 순간",
                        "새벽에 야식 먹다가 현타 왔다."),
                new Word("완전체", "구성원이 하나도 빠지지 않고 모두 모인 상태",
                        "오랜만에 완전체로 모였다.")
        ));

        log.info("초기 신조어 데이터 {}건을 넣었습니다.", wordRepository.count());
    }

    private void seedQuizWords(QuizRepository quizRepository) {
        if (quizRepository.count() > 0) {
            return;
        }

        // options 에는 "오답만" 넣는다. 정답은 QuizService 가 합쳐서 섞는다.
        quizRepository.saveAll(List.of(
                new QuizWord("억까", "억지로 까다",
                        new ArrayList<>(List.of("억지로 웃는 것", "억울해서 우는 것", "크게 화를 내는 것")),
                        "'억지로' 로 시작하는 말의 줄임말입니다."),
                new QuizWord("갓생", "부지런하고 계획적인 삶",
                        new ArrayList<>(List.of("운이 좋은 인생", "남에게 의지하는 삶", "즉흥적으로 사는 삶")),
                        "영어 God 과 인생을 합친 말입니다."),
                new QuizWord("알잘딱깔센", "알아서 잘 딱 깔끔하고 센스있게",
                        new ArrayList<>(List.of("알고 보니 딱한 사정", "알쏭달쏭 깔끔한 센스", "알차고 딱 좋은 센스")),
                        "다섯 글자 각각이 단어의 첫 글자입니다."),
                new QuizWord("중꺾마", "중요한 것은 꺾이지 않는 마음",
                        new ArrayList<>(List.of("중간에 꺾어 마무리", "중요한 건 꼼꼼한 마감", "중간에 꺾이면 마지막")),
                        "스포츠 경기에서 유행한 말입니다."),
                new QuizWord("스불재", "스스로 불러온 재앙",
                        new ArrayList<>(List.of("스스로 불편한 재주", "스치듯 불러온 재미", "스스로 불태운 재능")),
                        "자업자득과 비슷한 뜻입니다."),
                new QuizWord("혼밥", "혼자 밥을 먹는 것",
                        new ArrayList<>(List.of("혼내면서 밥 먹기", "혼합해서 먹는 밥", "혼자 밥을 짓는 것")),
                        "두 글자입니다."),
                new QuizWord("현타", "현실 자각 타임",
                        new ArrayList<>(List.of("현재 타이밍", "현금 타격", "현실 탈출")),
                        "들떠 있다가 현실을 깨닫는 순간입니다."),
                new QuizWord("킹받네", "몹시 화가 난다는 뜻",
                        new ArrayList<>(List.of("칭찬받았다는 뜻", "왕이 되었다는 뜻", "상을 받았다는 뜻")),
                        "'열받네' 를 더 강조한 말입니다.")
        ));

        log.info("초기 퀴즈 데이터 {}건을 넣었습니다.", quizRepository.count());
    }
}
