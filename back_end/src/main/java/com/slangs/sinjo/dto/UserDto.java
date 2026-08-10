package com.slangs.sinjo.dto;

import com.slangs.sinjo.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

/**
 * 요청과 응답을 나눴다.
 * 하나로 쓰면 응답 JSON 에 password 필드가 그대로 실려 나간다.
 */
public class UserDto {

    public record SignupRequest(
            @NotBlank(message = "이메일을 입력해 주세요.")
            @Email(message = "이메일 형식이 올바르지 않습니다.")
            String email,

            @NotBlank(message = "비밀번호를 입력해 주세요.")
            @Size(min = 8, max = 64, message = "비밀번호는 8자 이상이어야 합니다.")
            String password,

            @NotBlank(message = "닉네임을 입력해 주세요.")
            @Size(min = 2, max = 30, message = "닉네임은 2자 이상 30자 이하여야 합니다.")
                    String nickname
    ) {
    }

    public record LoginRequest(
            @NotBlank(message = "이메일을 입력해 주세요.")
            String email,

            @NotBlank(message = "비밀번호를 입력해 주세요.")
            String password
    ) {
    }

    /**
     * 응답에는 비밀번호를 절대 담지 않는다.
     */
    public record Response(
            Long id,
            String email,
            String nickname,
            LocalDateTime createdAt,
            LocalDateTime lastLoginAt
    ) {
        public static Response from(User user) {
            return new Response(
                    user.getId(),
                    user.getEmail(),
                    user.getNickname(),
                    user.getCreatedAt(),
                    user.getLastLoginAt()
            );
        }
    }

    public record LoginResponse(
            String token,
            Response user
    ) {}
}
