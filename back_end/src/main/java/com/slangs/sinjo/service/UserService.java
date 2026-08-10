package com.slangs.sinjo.service;

import com.slangs.sinjo.dto.UserDto;
import com.slangs.sinjo.entity.User;
import com.slangs.sinjo.exception.DuplicateEmailException;
import com.slangs.sinjo.exception.InvalidCredentialsException;
import com.slangs.sinjo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserDto.Response signup(UserDto.SignupRequest request) {
        String email = normalizeEmail(request.email());

        if (userRepository.existsByEmail(email)) {
            throw new DuplicateEmailException();
        }

        User user = new User();
        user.setEmail(email);
        // 평문 저장 금지. 해시해서 넣는다.
        user.setPassword(passwordEncoder.encode(request.password()));

        User saved = userRepository.save(user);
        return new UserDto.Response(saved.getId(), saved.getEmail());
    }

    @Transactional(readOnly = true)
    public UserDto.Response login(UserDto.LoginRequest request) {
        User user = userRepository.findByEmail(normalizeEmail(request.email()))
                .orElseThrow(InvalidCredentialsException::new);

        // 해시는 원문으로 되돌릴 수 없다. matches 로 대조한다.
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        return new UserDto.Response(user.getId(), user.getEmail());
    }

    /**
     * 이메일은 대소문자를 구분하지 않는 것이 사용자 기대에 맞다.
     * 저장·조회 모두 소문자로 통일해 Kim@... 과 kim@... 이 다른 계정이 되는 것을 막는다.
     */
    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}
