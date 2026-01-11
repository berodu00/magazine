package com.koreazinc.sabosystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Map;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReactionSummaryDto {
    private Map<String, Long> reactions; // e.g., {"LIKE": 10, "SAD": 2}
    private String userReaction; // Current user's reaction (or null)
}
