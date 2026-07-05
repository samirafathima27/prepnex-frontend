package com.prepnex.dto;

import lombok.Data;

@Data
public class SubmissionResponse {
    private String status;
    private String output;
    private String expectedOutput;
    private boolean correct;
    private String message;
}