package com.koreazinc.sabosystem.config;

import com.koreazinc.sabosystem.entity.User;
import com.koreazinc.sabosystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeAdmin();
    }

    private void initializeAdmin() {
        String adminEmail = "admin@koreazinc.com";
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            log.info("Creating default admin account: {}", adminEmail);
            User admin = User.builder()
                    .email(adminEmail)
                    .password(passwordEncoder.encode("admin123"))
                    .name("관리자")
                    .department("IT팀")
                    .role("ADMIN")
                    .build();
            userRepository.save(admin);
            log.info("Admin account created successfully.");
        } else {
            log.info("Admin account already exists. Updating password to ensure access.");
            ensurePasswordMatch(adminEmail, "admin123");
        }
    }

    private void ensurePasswordMatch(String email, String rawPassword) {
        User user = userRepository.findByEmail(email).get();
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            log.info("Password mismatch for {}. Updating to default.", email);
            user.updatePassword(passwordEncoder.encode(rawPassword));
            userRepository.save(user);
            log.info("Password updated successfully.");
        }
    }
}
