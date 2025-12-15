package com.prashant.jobtracker.service;

import com.prashant.jobtracker.dto.JobApplicationDTO;
import com.prashant.jobtracker.dto.Response;
import com.prashant.jobtracker.entity.enums.JobStatus;

import java.time.LocalDate;
import java.util.List;

public interface JobService {

    Response addJob(JobApplicationDTO jobApplicationDTO);

    JobApplicationDTO getJobById(Long id);

    Response deleteJob(Long id);

    List<JobApplicationDTO> getAllJobs(int page);

    List<JobApplicationDTO> getJobsBetweenDates(LocalDate from, LocalDate to);

    JobApplicationDTO updateJob(Long id, JobApplicationDTO jobApplicationDTO);


    List<JobApplicationDTO> getJobsByCompany(String companyName);

    List<JobApplicationDTO> getJobsByStatus(JobStatus status);
}
