package com.prashant.jobtracker.dto;

import com.prashant.jobtracker.entity.enums.JobStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;


@Data
public class JobApplicationDTO {


    private Long id;

    @NotBlank(message = "please enter valid company Name")
    private String companyName;

    private String jobRole;

    private String comment;

    private JobStatus status;

    private String resumeUsed;

    private LocalDate appliedDate;


}
