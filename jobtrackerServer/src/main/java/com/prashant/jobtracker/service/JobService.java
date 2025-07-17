package com.prashant.jobtracker.service;

import com.prashant.jobtracker.dto.JobApplicationDTO;
import com.prashant.jobtracker.dto.Response;
import com.prashant.jobtracker.entity.JobApplication;
import com.prashant.jobtracker.entity.User;
import com.prashant.jobtracker.exception.ResourceNotFoundException;
import com.prashant.jobtracker.exception.UnauthorizedAccessException;
import com.prashant.jobtracker.repository.JobRepository;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class JobService {

    private final static int PAGE_SIZE = 10;

    private final JobRepository jobRepository;
    private final ModelMapper modelMapper;
    private final UserService userService;

    public JobService(JobRepository jobRepository, ModelMapper modelMapper, UserService userService) {
        this.jobRepository = jobRepository;
        this.modelMapper = modelMapper;
        this.userService = userService;
    }

    private JobApplication convertToEntity(JobApplicationDTO jobApplicationDTO) {
        return modelMapper.map(jobApplicationDTO,JobApplication.class);
    }

    private JobApplicationDTO convertToDTO(JobApplication jobApplication) {
        return modelMapper.map(jobApplication,JobApplicationDTO.class);
    }

    @Transactional
    public Response addJob( JobApplicationDTO jobApplicationDTO) {

        JobApplication jobApplication = convertToEntity(jobApplicationDTO);

        User user = userService.getLoggedInUser();
        jobApplication.setUser(user);

        JobApplication savedJob = jobRepository.save(jobApplication);

        return  Response.builder().message("Job Details Saved Successfully").build();
    }

    public JobApplicationDTO getJobById(Long id) {
        JobApplication jobApplication = jobRepository.findById(id).orElseThrow(()->
                new ResourceNotFoundException("Invalid Job Id, no job found with given Id:"+id));
        return convertToDTO(jobApplication);
    }

    @Transactional
    public Response deleteJob(Long id) {
        JobApplication jobApplication = jobRepository.findById(id).orElseThrow(()->
                new ResourceNotFoundException("Invalid Job Id, no job found with given Id:"+id));
        jobRepository.delete(jobApplication);

        return Response.builder().message("Job details delete successfully").build();
    }


    public List<JobApplicationDTO> getAllJobs(int page) {
       Pageable pageDetails = PageRequest.of(page,PAGE_SIZE);
       Page<JobApplication> pages = jobRepository.findAll(pageDetails);
       return 
               pages.stream()
                       .map(this::convertToDTO)
                       .toList();
    }


    public List<JobApplicationDTO> getJobsBetweenDates(LocalDate from, LocalDate to) {
        List<JobApplication> jobApplications = jobRepository.findByAppliedDateBetween(from, to);

        return jobApplications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public JobApplicationDTO updateJob(Long id,JobApplicationDTO jobApplicationDTO) {

        JobApplication existingJob = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        User currentUser = userService.getLoggedInUser();
        if (!existingJob.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedAccessException("You are not authorized to update this job.");
        }

        // Map only the updatable fields from DTO to entity
        modelMapper.map(jobApplicationDTO, existingJob);

        JobApplication updatedJob = jobRepository.save(existingJob);

        // Convert back to DTO
        return modelMapper.map(updatedJob, JobApplicationDTO.class);
    }

}
