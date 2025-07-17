package com.prashant.jobtracker.service;

import com.prashant.jobtracker.dto.UserDTO;
import com.prashant.jobtracker.entity.User;
import com.prashant.jobtracker.exception.ResourceAlreadyExistsException;
import com.prashant.jobtracker.exception.ResourceNotFoundException;
import com.prashant.jobtracker.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Slf4j
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, ModelMapper modelMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.passwordEncoder = passwordEncoder;
    }

    private User convertToEntity(UserDTO userDTO ){
        return modelMapper.map(userDTO,User.class);
    }

    private UserDTO convertToDTO(User user) {
        return modelMapper.map(user,UserDTO.class);
    }

    @Transactional
    public UserDTO signUp(@Valid UserDTO userData) {
        String email = userData.getEmail();
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isPresent())
            throw  new ResourceAlreadyExistsException("User is Already Registered ! Log-in");

        User toBeCreatedUser = convertToEntity(userData);

        // hash the user given password
        String password = userData.getPassword();
        String hashPassword = passwordEncoder.encode(password);

        // set the hashPassword into the user and create
        toBeCreatedUser.setPassword(hashPassword);

        User savedUser = userRepository.save(toBeCreatedUser);

        return convertToDTO(savedUser);

    }

    public User getLoggedInUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof User) {
            return (User) principal;
        }

        return null;
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username).orElseThrow(()->
                new ResourceNotFoundException("User not Registered"));
    }
}
