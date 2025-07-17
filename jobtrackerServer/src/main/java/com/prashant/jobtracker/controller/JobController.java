package com.prashant.jobtracker.controller;

import com.prashant.jobtracker.dto.JobApplicationDTO;
import com.prashant.jobtracker.dto.Response;
import com.prashant.jobtracker.entity.JobApplication;
import com.prashant.jobtracker.service.JobService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    /**
     * Add a new job application
     */
    @PostMapping
    public ResponseEntity<Response> addJobDetails(@Valid @RequestBody JobApplicationDTO jobApplicationDTO) {
        Response resp= jobService.addJob(jobApplicationDTO);
        return new ResponseEntity<>(resp, HttpStatus.CREATED);
    }

    /**
     * Get a job application by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<JobApplicationDTO> getJobById(@PathVariable Long id) {
        JobApplicationDTO jobApplication = jobService.getJobById(id);
        return ResponseEntity.ok(jobApplication);
    }

    /**
     * Update a job application
     */
    @PutMapping("/{id}")
    public ResponseEntity<JobApplicationDTO> updateJob(@PathVariable Long id, @Valid @RequestBody JobApplicationDTO jobApplicationDTO) {
        JobApplicationDTO updatedJobApplication = jobService.updateJob(id,jobApplicationDTO);
        return ResponseEntity.ok(updatedJobApplication);
    }

    /**
     * Delete a job application
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Response> deleteJob(@PathVariable Long id) {
        Response resp = jobService.deleteJob(id);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }


    /**
     * Get all job applications
     */
    @GetMapping
    public ResponseEntity<List<JobApplicationDTO>> getAllJobs(@RequestParam(defaultValue = "0") int page) {
        List<JobApplicationDTO> jobApplicationDTOS = jobService.getAllJobs(page);
        return ResponseEntity.ok(jobApplicationDTOS);
    }


    /**
     * Get all jobs applied between two dates
     */
    @GetMapping("/between")
    public ResponseEntity<List<JobApplicationDTO>> getJobsBetweenDates(
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        List<JobApplicationDTO> jobApplicationDTOS = jobService.getJobsBetweenDates(from,to);
        return ResponseEntity.ok(jobApplicationDTOS);
    }

}
