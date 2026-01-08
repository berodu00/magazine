package com.koreazinc.sabosystem.controller;

import com.koreazinc.sabosystem.dto.auth.AuthResponse;
import com.koreazinc.sabosystem.dto.auth.LoginRequest;
import com.koreazinc.sabosystem.dto.auth.RefreshTokenRequest;
import com.koreazinc.sabosystem.dto.auth.TokenResponse;
import com.koreazinc.sabosystem.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@RequestBody @Valid RefreshTokenRequest request) {
        TokenResponse response = authService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@RequestHeader("Authorization") String token) {
        // Stateless 방식이므로 클라이언트에서 토큰 삭제 처리
        // 필요 시 블랙리스트 구현 가능
        return ResponseEntity.ok(Map.of("message", "로그아웃되었습니다."));
    }
}
