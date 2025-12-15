package com.prashant.jobtracker.service.impl;

import com.prashant.jobtracker.dto.LoginRequestDTO;
import com.prashant.jobtracker.dto.Response;
import com.prashant.jobtracker.dto.UserDTO;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl {

    private final AuthenticationManager authenticationManager;
    private final UserServiceImpl userServiceImpl;

    public AuthServiceImpl(AuthenticationManager authenticationManager, UserServiceImpl userServiceImpl) {
        this.authenticationManager = authenticationManager;
        this.userServiceImpl = userServiceImpl;
    }

    public Response login(LoginRequestDTO loginRequest, HttpServletRequest request) {
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword());

        Authentication authentication = authenticationManager.authenticate(authToken);

        SecurityContext securityContext = SecurityContextHolder.getContext();
        securityContext.setAuthentication(authentication);

        HttpSession session = request.getSession(true);
        session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext);

        return new Response("Login successful");
    }

    public UserDTO signUp( UserDTO userData) {
        return userServiceImpl.signUp(userData);
    }

    public void logout(HttpServletRequest request, HttpServletResponse response) {

        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        SecurityContextHolder.clearContext();

        // Remove JSESSIONID cookie
        Cookie cookie = new Cookie("JSESSIONID", null);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

}
