package com.prashant.jobtracker.service;

import com.prashant.jobtracker.dto.LoginRequestDTO;
import com.prashant.jobtracker.dto.Response;
import com.prashant.jobtracker.dto.UserDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {

    Response login(LoginRequestDTO loginRequest, HttpServletRequest request);

    UserDTO signUp(UserDTO userData);

    void logout(HttpServletRequest request, HttpServletResponse response);
}
