package com.prashant.jobtracker.controller;

import com.prashant.jobtracker.dto.JobApplicationDTO;
import com.prashant.jobtracker.dto.Response;
import com.prashant.jobtracker.entity.enums.JobStatus;
import com.prashant.jobtracker.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @PostMapping
    public ResponseEntity<Response> addJobDetails(@Valid @RequestBody JobApplicationDTO jobApplicationDTO) {

        Response resp = jobService.addJob(jobApplicationDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobApplicationDTO> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobApplicationDTO> updateJob(@PathVariable Long id, @Valid @RequestBody JobApplicationDTO jobApplicationDTO) {

        return ResponseEntity.ok(jobService.updateJob(id, jobApplicationDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Response> deleteJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.deleteJob(id));
    }

    @GetMapping
    public ResponseEntity<List<JobApplicationDTO>> getAllJobs(@RequestParam(defaultValue = "0") int page) {

        return ResponseEntity.ok(jobService.getAllJobs(page));
    }

    @GetMapping("/between")
    public ResponseEntity<List<JobApplicationDTO>> getJobsBetweenDates(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        return ResponseEntity.ok(jobService.getJobsBetweenDates(from, to));
    }

    @GetMapping("/company/{companyName}")
    public ResponseEntity<List<JobApplicationDTO>> getJobsByCompany(@PathVariable String companyName) {
        return ResponseEntity.ok(jobService.getJobsByCompany(companyName));
    }

    @GetMapping(params = "status")
    public ResponseEntity<List<JobApplicationDTO>> getJobsByStatus(@RequestParam JobStatus status) {

        return ResponseEntity.ok(jobService.getJobsByStatus(status));
    }



}
