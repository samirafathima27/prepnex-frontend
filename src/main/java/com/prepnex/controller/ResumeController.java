package com.prepnex.controller;

import com.prepnex.model.Resume;
import com.prepnex.service.ResumeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping
    public ResponseEntity<Resume> addResume(@Valid @RequestBody Resume resume) {
        return ResponseEntity.ok(resumeService.addResume(resume));
    }

    @GetMapping
    public ResponseEntity<List<Resume>> getAllResumes() {
        return ResponseEntity.ok(resumeService.getAllResumes());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resume> updateResume(@PathVariable Long id, @Valid @RequestBody Resume resume) {
        return ResponseEntity.ok(resumeService.updateResume(id, resume));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResume(@PathVariable Long id) {
        resumeService.deleteResume(id);
        return ResponseEntity.noContent().build();
    }
}
