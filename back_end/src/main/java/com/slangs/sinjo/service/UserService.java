package com.slangs.sinjo.service;

import com.slangs.sinjo.dto.UserDto;
import com.slangs.sinjo.entity.User;
import com.slangs.sinjo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    @Transactional
    public UserDto signup(UserDto request) {
        // 이메일 중복 확인
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        // DTO를 Entity로 변환
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        // DB에 저장
        User savedUser = userRepository.save(user);

        // Entity를 DTO로 변환해서 반환
        UserDto response = new UserDto();
        response.setId(savedUser.getId());
        response.setEmail(savedUser.getEmail());

        return response;
    }

    @Transactional(readOnly = true)
    public UserDto login(UserDto request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));

        if (!user.getPassword().equals(request.getPassword())){
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        UserDto response = new UserDto();
        response.setId(user.getId());
        response.setEmail(user.getEmail());

        return response;
    }
}
