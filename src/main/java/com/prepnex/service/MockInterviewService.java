package com.prepnex.service;

import com.prepnex.model.MockInterview;
import com.prepnex.repository.MockInterviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MockInterviewService {

    private final MockInterviewRepository mockInterviewRepository;

    public MockInterview addInterview(MockInterview interview) {
        return mockInterviewRepository.save(interview);
    }

    public List<MockInterview> getAllInterviews() {
        return mockInterviewRepository.findAll();
    }

    public MockInterview updateInterview(Long id, MockInterview updated) {
        MockInterview existing = mockInterviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interview not found"));
        existing.setCompany(updated.getCompany());
        existing.setRoundType(updated.getRoundType());
        existing.setWentWell(updated.getWentWell());
        existing.setWentBadly(updated.getWentBadly());
        existing.setDate(updated.getDate());
        return mockInterviewRepository.save(existing);
    }

    public void deleteInterview(Long id) {
        mockInterviewRepository.deleteById(id);
    }
}