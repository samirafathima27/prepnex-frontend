package com.prepnex.repository;

import com.prepnex.model.User;
import com.prepnex.model.UserProgress;
import com.prepnex.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {
    List<UserProgress> findByUser(User user);
    List<UserProgress> findByUserAndStatus(User user, String status);
    Optional<UserProgress> findByUserAndQuestion(User user, Question question);
}