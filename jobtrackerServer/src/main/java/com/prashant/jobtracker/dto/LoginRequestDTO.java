package com.prashant.jobtracker.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data

public class LoginRequestDTO {

    @NotNull(message = "Please enter your email")
    @Email(message = "Please enter valid email")
    private String email;

    @NotNull(message = "Please enter your password")
    @NotBlank(message = "please enter your password")
    private String password;
}
