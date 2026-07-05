package com.prepnex.service;

import com.prepnex.dto.SubmissionRequest;
import com.prepnex.dto.SubmissionResponse;
import com.prepnex.model.Question;
import com.prepnex.model.User;
import com.prepnex.model.UserProgress;
import com.prepnex.repository.QuestionRepository;
import com.prepnex.repository.UserProgressRepository;
import com.prepnex.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class Judge0Service {

    private final QuestionRepository questionRepository;
    private final UserProgressRepository userProgressRepository;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public SubmissionResponse submitCode(SubmissionRequest request) {
        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question not found"));

        SubmissionResponse response = new SubmissionResponse();

        try {
            String output = executeCode(
                    request.getLanguage(),
                    request.getSourceCode(),
                    question.getSampleInput() != null ? question.getSampleInput() : ""
            );

            String expectedOutput = question.getExpectedOutput() != null ?
                    question.getExpectedOutput().trim() : "";
            String actualOutput = output.trim();
            boolean isCorrect = actualOutput.equals(expectedOutput);

            response.setStatus("Accepted");
            response.setOutput(actualOutput);
            response.setExpectedOutput(expectedOutput);
            response.setCorrect(isCorrect);
            response.setMessage(isCorrect ? "Correct! Well done! 🎉" : "Wrong Answer. Try again!");

            // Update user progress
            User currentUser = getCurrentUser();
            UserProgress progress = userProgressRepository
                    .findByUserAndQuestion(currentUser, question)
                    .orElse(new UserProgress());

            progress.setUser(currentUser);
            progress.setQuestion(question);
            progress.setStatus(isCorrect ? "Solved" : "Attempted");
            if (isCorrect) progress.setSolvedDate(LocalDate.now());
            userProgressRepository.save(progress);

        } catch (Exception e) {
            response.setStatus("Error");
            response.setOutput("");
            response.setCorrect(false);
            response.setMessage("Runtime Error: " + e.getMessage());
        }

        return response;
    }

    private String executeCode(String language, String code, String input) throws Exception {
        Path tempDir = Files.createTempDirectory("prepnex_");

        try {
            return switch (language.toLowerCase()) {
                case "python" -> runPython(tempDir, code, input);
                case "java" -> runJava(tempDir, code, input);
                case "c++" -> runCpp(tempDir, code, input);
                case "c" -> runC(tempDir, code, input);
                default -> runPython(tempDir, code, input);
            };
        } finally {
            deleteDirectory(tempDir.toFile());
        }
    }

    private String runPython(Path dir, String code, String input) throws Exception {
        Path file = dir.resolve("solution.py");
        Files.writeString(file, code);
        return runProcess(new String[]{"python", file.toString()}, input, dir);
    }

    private String runJava(Path dir, String code, String input) throws Exception {
        Path file = dir.resolve("Main.java");
        Files.writeString(file, code);
        runProcess(new String[]{"javac", file.toString()}, "", dir);
        return runProcess(new String[]{"java", "-cp", dir.toString(), "Main"}, input, dir);
    }

    private String runCpp(Path dir, String code, String input) throws Exception {
        Path file = dir.resolve("solution.cpp");
        Path output = dir.resolve("solution");
        Files.writeString(file, code);
        runProcess(new String[]{"g++", file.toString(), "-o", output.toString()}, "", dir);
        return runProcess(new String[]{output.toString()}, input, dir);
    }

    private String runC(Path dir, String code, String input) throws Exception {
        Path file = dir.resolve("solution.c");
        Path output = dir.resolve("solution");
        Files.writeString(file, code);
        runProcess(new String[]{"gcc", file.toString(), "-o", output.toString()}, "", dir);
        return runProcess(new String[]{output.toString()}, input, dir);
    }

    private String runProcess(String[] command, String input, Path dir) throws Exception {
        ProcessBuilder pb = new ProcessBuilder(command);
        pb.directory(dir.toFile());
        pb.redirectErrorStream(true);

        Process process = pb.start();

        if (!input.isEmpty()) {
            try (OutputStream os = process.getOutputStream()) {
                os.write(input.getBytes());
            }
        }

        boolean finished = process.waitFor(10, TimeUnit.SECONDS);
        if (!finished) {
            process.destroyForcibly();
            throw new RuntimeException("Time Limit Exceeded");
        }

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream()))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line).append("\n");
            }
            return sb.toString().trim();
        }
    }

    private void deleteDirectory(File dir) {
        if (dir.isDirectory()) {
            for (File f : dir.listFiles()) deleteDirectory(f);
        }
        dir.delete();
    }
}