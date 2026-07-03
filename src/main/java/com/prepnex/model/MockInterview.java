package com.prepnex.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "mock_interviews")
public class MockInterview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Company is required")
    private String company;

    @NotBlank(message = "Round type is required")
    private String roundType;

    private String wentWell;
    private String wentBadly;

    @NotNull(message = "Date is required")
    private LocalDate date;
}