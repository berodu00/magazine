package com.koreazinc.sabosystem.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ReactionRequestDto {

    @NotNull(message = "반응 유형은 필수입니다.")
    @Pattern(regexp = "^(LIKE|SAD|ANGRY|FUNNY)$", message = "유효하지 않은 반응 유형입니다.")
    private String reactionType;
}
