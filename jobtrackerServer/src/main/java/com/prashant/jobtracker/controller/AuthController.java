package com.prashant.jobtracker.controller;

import com.prashant.jobtracker.dto.LoginRequestDTO;
import com.prashant.jobtracker.dto.Response;
import com.prashant.jobtracker.dto.UserDTO;
import com.prashant.jobtracker.service.impl.AuthServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@Slf4j
public class AuthController {

    @Autowired
    private AuthServiceImpl authServiceImpl;

    @PostMapping("/login")
    public ResponseEntity<Response> login(@RequestBody LoginRequestDTO loginRequest, HttpServletRequest request) {
        Response response = authServiceImpl.login(loginRequest, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<UserDTO> signup(@Valid @RequestBody UserDTO userData) {
        UserDTO savedUser = authServiceImpl.signUp(userData);
        log.info("User signed up successfully: {}", savedUser);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    @PostMapping("/logout")
    public ResponseEntity<Response> logout(HttpServletRequest request, HttpServletResponse response) {
        authServiceImpl.logout(request,response);
        return ResponseEntity.ok(new Response("Logout successful"));
    }


}
