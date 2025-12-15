package com.prashant.jobtracker.controller;

import com.prashant.jobtracker.dto.JobApplicationDTO;
import com.prashant.jobtracker.dto.Response;

import com.prashant.jobtracker.service.impl.JobServiceImpl;
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

    private final JobServiceImpl jobServiceImpl;

    public JobController(JobServiceImpl jobServiceImpl) {
        this.jobServiceImpl = jobServiceImpl;
    }

    @PostMapping
    public ResponseEntity<Response> addJobDetails(@Valid @RequestBody JobApplicationDTO jobApplicationDTO) {
        Response resp= jobServiceImpl.addJob(jobApplicationDTO);
        return new ResponseEntity<>(resp, HttpStatus.CREATED);
    }


    @GetMapping("/{id}")
    public ResponseEntity<JobApplicationDTO> getJobById(@PathVariable Long id) {
        JobApplicationDTO jobApplication = jobServiceImpl.getJobById(id);
        return ResponseEntity.ok(jobApplication);
    }


    @PutMapping("/{id}")
    public ResponseEntity<JobApplicationDTO> updateJob(@PathVariable Long id, @Valid @RequestBody JobApplicationDTO jobApplicationDTO) {
        JobApplicationDTO updatedJobApplication = jobServiceImpl.updateJob(id,jobApplicationDTO);
        return ResponseEntity.ok(updatedJobApplication);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Response> deleteJob(@PathVariable Long id) {
        Response resp = jobServiceImpl.deleteJob(id);
        return ResponseEntity.status(HttpStatus.OK).body(resp);
    }

    @GetMapping
    public ResponseEntity<List<JobApplicationDTO>> getAllJobs(@RequestParam(defaultValue = "0") int page) {
        List<JobApplicationDTO> jobApplicationDTOS = jobServiceImpl.getAllJobs(page);
        return ResponseEntity.ok(jobApplicationDTOS);
    }



    @GetMapping("/between")
    public ResponseEntity<List<JobApplicationDTO>> getJobsBetweenDates(
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        List<JobApplicationDTO> jobApplicationDTOS = jobServiceImpl.getJobsBetweenDates(from,to);
        return ResponseEntity.ok(jobApplicationDTOS);
    }

}
