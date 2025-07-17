package com.prashant.jobtracker.controller;

import com.prashant.jobtracker.dto.UserDTO;
import com.prashant.jobtracker.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<UserDTO > getUserDetails(){
        UserDTO user = userService.getUserDetails();
        return ResponseEntity.ok(user);
    }


}
