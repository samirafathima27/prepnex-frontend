package com.prepnex.controller;

import com.prepnex.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AiController {

    private final AiService aiService;

    @GetMapping("/suggestions")
    public ResponseEntity<Map<String, String>> getSuggestions() {
        String suggestions = aiService.getSuggestions();
        return ResponseEntity.ok(Map.of("suggestions", suggestions));
    }
}