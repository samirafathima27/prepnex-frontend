package com.prepnex.service;

import com.prepnex.model.Application;
import com.prepnex.model.MockInterview;
import com.prepnex.model.User;
import com.prepnex.model.UserProgress;
import com.prepnex.repository.ApplicationRepository;
import com.prepnex.repository.MockInterviewRepository;
import com.prepnex.repository.UserProgressRepository;
import com.prepnex.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiService {

    @Value("${groq.api.key}")
    private String groqApiKey;

    @Value("${groq.api.url}")
    private String groqApiUrl;

    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final UserProgressRepository userProgressRepository;
    private final MockInterviewRepository mockInterviewRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public String getSuggestions() {
        User user = getCurrentUser();

        // Gather user data
        List<Application> applications = applicationRepository.findByUser(user);
        List<UserProgress> progress = userProgressRepository.findByUser(user);
        List<MockInterview> interviews = mockInterviewRepository.findByUser(user);

        // Build context summary
        long solvedCount = progress.stream()
                .filter(p -> "Solved".equals(p.getStatus())).count();

        Map<String, Long> topicCount = progress.stream()
                .filter(p -> "Solved".equals(p.getStatus()) && p.getQuestion() != null)
                .collect(Collectors.groupingBy(
                        p -> p.getQuestion().getTopic(),
                        Collectors.counting()));

        String weakTopics = topicCount.isEmpty() ? "none yet" :
                topicCount.entrySet().stream()
                        .filter(e -> e.getValue() < 5)
                        .map(Map.Entry::getKey)
                        .collect(Collectors.joining(", "));

        String applicationStatus = applications.isEmpty() ? "No applications yet" :
                applications.stream()
                        .map(a -> a.getCompanyName() + "(" + a.getStatus() + ")")
                        .collect(Collectors.joining(", "));

        String interviewWeaknesses = interviews.isEmpty() ? "No mock interviews logged" :
                interviews.stream()
                        .filter(i -> i.getWentBadly() != null)
                        .map(MockInterview::getWentBadly)
                        .collect(Collectors.joining(", "));

        // Build prompt
        String prompt = String.format("""
                You are a placement preparation coach for an Indian engineering student.
                Here is their current preparation data:
                
                - Total DSA problems solved: %d
                - Topics with less than 5 problems solved (weak areas): %s
                - Job applications: %s
                - Mock interview weaknesses: %s
                - Target role: %s
                
                Give exactly 3 specific, actionable coaching suggestions to improve their placement preparation.
                Be direct, practical, and encouraging. Each suggestion should be 1-2 sentences.
                Format as numbered list: 1. ... 2. ... 3. ...
                """,
                solvedCount,
                weakTopics,
                applicationStatus,
                interviewWeaknesses,
                user.getTargetRole() != null ? user.getTargetRole() : "Software Engineer"
        );

        // Call Groq API
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(groqApiKey);

        Map<String, Object> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "llama-3.3-70b-versatile");
        body.put("messages", List.of(message));
        body.put("max_tokens", 500);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                groqApiUrl, entity, Map.class);

        Map<String, Object> result = response.getBody();
        List<Map<String, Object>> choices = (List<Map<String, Object>>) result.get("choices");
        Map<String, Object> firstChoice = choices.get(0);
        Map<String, Object> messageResponse = (Map<String, Object>) firstChoice.get("message");

        return (String) messageResponse.get("content");
    }
}