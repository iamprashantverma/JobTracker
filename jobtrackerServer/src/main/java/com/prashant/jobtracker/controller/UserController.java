package com.prashant.jobtracker.controller;

import com.prashant.jobtracker.dto.UserDTO;
import com.prashant.jobtracker.service.impl.UserServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserServiceImpl userServiceImpl;

    public UserController(UserServiceImpl userServiceImpl) {
        this.userServiceImpl = userServiceImpl;
    }

    @GetMapping
    public ResponseEntity<UserDTO > getUserDetails(){
        UserDTO user = userServiceImpl.getUserDetails();
        return ResponseEntity.ok(user);
    }


}
