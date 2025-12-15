package com.prashant.jobtracker.service;

import com.prashant.jobtracker.dto.UserDTO;
import com.prashant.jobtracker.entity.User;

public interface UserService {

    UserDTO signUp(UserDTO userData);

    UserDTO getUserDetails();

    User getLoggedInUser();
}
