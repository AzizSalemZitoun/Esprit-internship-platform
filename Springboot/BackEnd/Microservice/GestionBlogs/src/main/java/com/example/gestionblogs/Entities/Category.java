package com.example.gestionblogs.Entities;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Category {
    ADVICE, ACTUALITE;


    @JsonCreator
    public static Category fromString(String value) {
        return Category.valueOf(value.toUpperCase().replace("-", "_"));
    }
}
