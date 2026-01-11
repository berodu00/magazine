package com.koreazinc.sabosystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingResponseDto {
    private Double averageRating;
    private Long totalRatings;
    private Integer userRating;
}
