package com.slangs.sinjo.controller;

import com.slangs.sinjo.dto.UserDto;
import com.slangs.sinjo.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<UserDto.Response> signup(@Valid @RequestBody UserDto.SignupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto.LoginResponse> login(@Valid @RequestBody UserDto.LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @GetMapping("/mypage")
    public ResponseEntity<UserDto.Response> mypage(@AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(userService.getMyInfo(userId));
    }
}
