package com.prashant.jobtracker.service.impl;

import com.prashant.jobtracker.dto.JobApplicationDTO;
import com.prashant.jobtracker.dto.Response;
import com.prashant.jobtracker.entity.JobApplication;
import com.prashant.jobtracker.entity.User;
import com.prashant.jobtracker.entity.enums.JobStatus;
import com.prashant.jobtracker.exception.ResourceNotFoundException;
import com.prashant.jobtracker.exception.UnauthorizedAccessException;
import com.prashant.jobtracker.repository.JobRepository;
import com.prashant.jobtracker.service.CloudinaryService;
import com.prashant.jobtracker.service.JobService;
import com.prashant.jobtracker.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class JobServiceImpl  implements JobService {

    private final static int PAGE_SIZE = 10;

    private final JobRepository jobRepository;
    private final ModelMapper modelMapper;
    private final UserService userService;
    private final CloudinaryService cloudinaryService;


    @Transactional
    public Response addJob(JobApplicationDTO jobApplicationDTO, MultipartFile file) {

        JobApplication jobApplication = convertToEntity(jobApplicationDTO);
        String resumeLink = cloudinaryService.uploadPdf(file);
        jobApplication.setResumeUsed(resumeLink);
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
        User user = userService.getLoggedInUser();
        Long userId = user.getId();

        Pageable pageDetails = PageRequest.of(page, PAGE_SIZE);

        Page<JobApplication> jobPage = jobRepository.findByUserId(userId, pageDetails);

        return jobPage
                .stream()
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
    public JobApplicationDTO updateJob(Long id, JobApplicationDTO jobApplicationDTO) {

        JobApplication existingJob = jobRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Job not found with id: " + id));

        User currentUser = userService.getLoggedInUser();
        if (!existingJob.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedAccessException("You are not authorized to update this job.");
        }

        // Manually update only allowed fields (SAFE)
        existingJob.setCompanyName(jobApplicationDTO.getCompanyName());
        existingJob.setJobRole(jobApplicationDTO.getJobRole());
        existingJob.setComment(jobApplicationDTO.getComment());
        existingJob.setStatus(jobApplicationDTO.getStatus());
        JobApplication updatedJob = jobRepository.save(existingJob);

        return modelMapper.map(updatedJob, JobApplicationDTO.class);
    }

    @Override
    public List<JobApplicationDTO> getJobsByCompany(String company) {
        List<JobApplication> jobApplications = jobRepository.findAllByCompanyName(company);
        return jobApplications.stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Override
    public List<JobApplicationDTO> getJobsByStatus(JobStatus status) {

        User user = userService.getLoggedInUser();

        return jobRepository
                .findAllByStatusAndUserId(status, user.getId())
                .stream()
                .map(this::convertToDTO)
                .toList();

    }

    private JobApplication convertToEntity(JobApplicationDTO jobApplicationDTO) {
        return modelMapper.map(jobApplicationDTO,JobApplication.class);
    }

    private JobApplicationDTO convertToDTO(JobApplication jobApplication) {
        return modelMapper.map(jobApplication,JobApplicationDTO.class);
    }

}
