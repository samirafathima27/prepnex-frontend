package com.prepnex.service;

import com.prepnex.model.Resume;
import com.prepnex.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;

    public Resume addResume(Resume resume) {
        return resumeRepository.save(resume);
    }

    public List<Resume> getAllResumes() {
        return resumeRepository.findAll();
    }

    public Resume updateResume(Long id, Resume updated) {
        Resume existing = resumeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resume not found"));
        existing.setVersionName(updated.getVersionName());
        existing.setFileLink(updated.getFileLink());
        existing.setCompanySentTo(updated.getCompanySentTo());
        existing.setUploadDate(updated.getUploadDate());
        return resumeRepository.save(existing);
    }

    public void deleteResume(Long id) {
        resumeRepository.deleteById(id);
    }
}