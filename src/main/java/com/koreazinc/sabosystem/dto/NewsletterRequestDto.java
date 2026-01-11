package com.koreazinc.sabosystem.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewsletterRequestDto {
    private String subject;
    private List<Long> articleIds;
}
