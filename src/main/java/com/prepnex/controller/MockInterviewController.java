package com.prepnex.controller;

import com.prepnex.model.MockInterview;
import com.prepnex.service.MockInterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mockinterviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MockInterviewController {

    private final MockInterviewService mockInterviewService;

    @PostMapping
    public ResponseEntity<MockInterview> addInterview(@Valid @RequestBody MockInterview interview) {
        return ResponseEntity.ok(mockInterviewService.addInterview(interview));
    }

    @GetMapping
    public ResponseEntity<List<MockInterview>> getAllInterviews() {
        return ResponseEntity.ok(mockInterviewService.getAllInterviews());
    }

    @PutMapping("/{id}")
    public ResponseEntity<MockInterview> updateInterview(@PathVariable Long id, @Valid @RequestBody MockInterview interview) {
        return ResponseEntity.ok(mockInterviewService.updateInterview(id, interview));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInterview(@PathVariable Long id) {
        mockInterviewService.deleteInterview(id);
        return ResponseEntity.noContent().build();
    }
}