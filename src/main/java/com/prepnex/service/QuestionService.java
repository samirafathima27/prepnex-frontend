package com.prepnex.service;

import com.prepnex.model.Question;
import com.prepnex.model.User;
import com.prepnex.model.UserProgress;
import com.prepnex.repository.QuestionRepository;
import com.prepnex.repository.UserProgressRepository;
import com.prepnex.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final UserProgressRepository userProgressRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public List<Question> getQuestionsByTopic(String topic) {
        return questionRepository.findByTopic(topic);
    }

    public List<Question> getQuestionsByDifficulty(String difficulty) {
        return questionRepository.findByDifficulty(difficulty);
    }

    public List<Question> getQuestionsByTopicAndDifficulty(String topic, String difficulty) {
        return questionRepository.findByTopicAndDifficulty(topic, difficulty);
    }

    public List<Question> getQuestionsByCompany(String company) {
        return questionRepository.findByCompanyTagsContaining(company);
    }

    public Question getQuestionById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
    }

    public List<UserProgress> getUserProgress() {
        return userProgressRepository.findByUser(getCurrentUser());
    }

    public List<UserProgress> getSolvedQuestions() {
        return userProgressRepository.findByUserAndStatus(getCurrentUser(), "Solved");
    }
}