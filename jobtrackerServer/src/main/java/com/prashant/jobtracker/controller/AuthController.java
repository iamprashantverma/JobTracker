package com.prashant.jobtracker.controller;

import com.prashant.jobtracker.dto.LoginRequestDTO;
import com.prashant.jobtracker.dto.Response;
import com.prashant.jobtracker.dto.UserDTO;
import com.prashant.jobtracker.service.AuthService;
import com.prashant.jobtracker.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
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
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<Response> login(@RequestBody LoginRequestDTO loginRequest, HttpServletRequest request) {
        Response response = authService.login(loginRequest, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<UserDTO> signup(@Valid @RequestBody UserDTO userData) {
        UserDTO savedUser = authService.signUp(userData);
        log.info("User signed up successfully: {}", savedUser);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }


}
