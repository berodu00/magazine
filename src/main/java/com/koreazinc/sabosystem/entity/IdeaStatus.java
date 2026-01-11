package com.koreazinc.sabosystem.entity;

public enum IdeaStatus {
    PENDING("대기중"),
    REVIEWED("검토중"),
    ACCEPTED("채택됨"),
    REJECTED("반려됨");

    private final String description;

    IdeaStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
