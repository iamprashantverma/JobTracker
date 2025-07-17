package com.prashant.jobtracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Response {
    private String message;

    public Response(boolean b, String allJobsRetrieved, List<JobApplicationDTO> jobs) {
    }
}
