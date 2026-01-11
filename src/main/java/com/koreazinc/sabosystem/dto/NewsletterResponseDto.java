package com.koreazinc.sabosystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewsletterResponseDto {
    private Long newsletterId;
    private Integer recipientCount;
    private LocalDateTime sentAt;
    private String message;
}
