package com.koreazinc.sabosystem.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender emailSender;

    @Value("${app.mock.enabled:false}")
    private boolean mockEnabled;

    public void sendSimpleMessage(String to, String subject, String text) {
        if (mockEnabled) {
            log.info("Mock Email Mode ON. Email would be sent to: {}, Subject: {}, Content: {}", to, subject, text);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("newsletter@koreazinc.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            emailSender.send(message);
            log.info("Email sent key emailSender to {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}", to, e);
            // In a real system, we might want to throw or handle this differently (e.g.,
            // retry)
            // For now, logging error.
        }
    }
}
