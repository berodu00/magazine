package com.koreazinc.sabosystem.entity;

public enum PopupType {
    IMAGE("이미지형"),
    TEXT("텍스트형");

    private final String description;

    PopupType(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
