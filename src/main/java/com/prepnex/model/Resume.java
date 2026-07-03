package com.prepnex.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "resumes")
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Version name is required")
    private String versionName;

    @NotBlank(message = "File link is required")
    private String fileLink;

    private String companySentTo;
    private LocalDate uploadDate;
}