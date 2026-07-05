package com.prepnex.dto;

import lombok.Data;

@Data
public class SubmissionRequest {
    private Long questionId;
    private String sourceCode;
    private String language;
}