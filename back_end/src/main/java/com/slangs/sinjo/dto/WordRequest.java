package com.slangs.sinjo.dto;

public record WordRequest(
       String word,
       String category,
       String meaning,
       String example) {
}
