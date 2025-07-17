package com.prashant.jobtracker.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserDTO {

    private Long id;

    @NotBlank(message = "Please enter a valid name")
    private String name;

    @NotBlank(message = "Please enter your email")
    @Email(message = "Please enter a valid email address")
    private String email;

    @NotBlank(message = "Please enter your password")
    @Size(min = 5, max = 10, message = "Password length must be between 5 and 10 characters")
    private String password;

    @Override
    public String toString() {
        return this.id +": "+this.name;
    }

}
