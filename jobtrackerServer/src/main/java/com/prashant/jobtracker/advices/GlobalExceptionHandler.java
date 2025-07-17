package com.prashant.jobtracker.advices;

import com.prashant.jobtracker.exception.ResourceAlreadyExistsException;
import com.prashant.jobtracker.exception.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<APIResponse<?>>unknownException(Exception ex) {
        APIError err = APIError.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .message(ex.getMessage())
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new APIResponse<>(err));
    }

    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<APIResponse<?>> conflictHandler(ResourceAlreadyExistsException ex) {
        APIError err = APIError.builder()
                .message(ex.getMessage())
                .status(HttpStatus.CONFLICT)
                .build();
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new APIResponse<>(err));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<APIResponse<?>> resourceNotFoundHandler(ResourceAlreadyExistsException ex) {
        APIError err = APIError.builder()
                .message(ex.getMessage())
                .status(HttpStatus.NOT_FOUND)
                .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new APIResponse<>(err));
    }


}
