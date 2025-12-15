package com.prashant.jobtracker.dto;

import com.prashant.jobtracker.entity.enums.JobStatus;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class JobApplicationDTO {

    private Long id;

    @NotBlank(message = "Company name is required")
    @Size(min = 2, max = 100, message = "Company name must be between 2 and 100 characters")
    private String companyName;

    @NotBlank(message = "Job role is required")
    @Size(min = 2, max = 100, message = "Job role must be between 2 and 100 characters")
    private String jobRole;

    @Size(max = 500, message = "Comment must not exceed 500 characters")
    private String comment;

    @NotNull(message = "Job status is required")
    private JobStatus status;

    private String resumeUsed;

    private String jobId;

    @NotNull(message = "Applied date is required")
    @PastOrPresent(message = "Applied date cannot be in the future")
    private LocalDate appliedDate;
}
