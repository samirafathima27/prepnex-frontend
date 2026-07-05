package com.prepnex.controller;

import com.prepnex.dto.SubmissionRequest;
import com.prepnex.dto.SubmissionResponse;
import com.prepnex.model.Question;
import com.prepnex.model.UserProgress;
import com.prepnex.service.Judge0Service;
import com.prepnex.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QuestionController {

    private final QuestionService questionService;
    private final Judge0Service judge0Service;

    @GetMapping
    public ResponseEntity<List<Question>> getAllQuestions(
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String company) {

        if (topic != null && difficulty != null) {
            return ResponseEntity.ok(questionService.getQuestionsByTopicAndDifficulty(topic, difficulty));
        } else if (topic != null) {
            return ResponseEntity.ok(questionService.getQuestionsByTopic(topic));
        } else if (difficulty != null) {
            return ResponseEntity.ok(questionService.getQuestionsByDifficulty(difficulty));
        } else if (company != null) {
            return ResponseEntity.ok(questionService.getQuestionsByCompany(company));
        }
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Long id) {
        return ResponseEntity.ok(questionService.getQuestionById(id));
    }

    @PostMapping("/submit")
    public ResponseEntity<SubmissionResponse> submitCode(@RequestBody SubmissionRequest request) {
        return ResponseEntity.ok(judge0Service.submitCode(request));
    }

    @GetMapping("/progress")
    public ResponseEntity<List<UserProgress>> getUserProgress() {
        return ResponseEntity.ok(questionService.getUserProgress());
    }

    @GetMapping("/solved")
    public ResponseEntity<List<UserProgress>> getSolvedQuestions() {
        return ResponseEntity.ok(questionService.getSolvedQuestions());
    }
}