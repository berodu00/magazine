package com.koreazinc.sabosystem.service;

import com.koreazinc.sabosystem.dto.auth.AuthResponse;
import com.koreazinc.sabosystem.dto.auth.LoginRequest;
import com.koreazinc.sabosystem.dto.auth.TokenResponse;
import com.koreazinc.sabosystem.dto.user.UserDto;
import com.koreazinc.sabosystem.entity.User;
import com.koreazinc.sabosystem.repository.UserRepository;
import com.koreazinc.sabosystem.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @Value("${security.jwt.expiration}")
    private long accessExpiration;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        // 1. 이메일/비밀번호 인증
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        // 2. 토큰 생성
        String accessToken = jwtTokenProvider.createToken(authentication);
        String refreshToken = jwtTokenProvider.createRefreshToken(authentication);

        // 3. 사용자 정보 조회
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(accessExpiration)
                .user(UserDto.from(user))
                .build();
    }

    @Transactional(readOnly = true)
    public TokenResponse refreshToken(String refreshToken) {
        // 1. Refresh Token 검증
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("유효하지 않은 Refresh Token입니다.");
        }

        // 2. 토큰에서 인증 정보 추출
        Authentication authentication = jwtTokenProvider.getAuthentication(refreshToken);

        // 3. 새로운 Access Token 생성
        String newAccessToken = jwtTokenProvider.createToken(authentication);

        return TokenResponse.builder()
                .accessToken(newAccessToken)
                .expiresIn(accessExpiration)
                .build();
    }
}
