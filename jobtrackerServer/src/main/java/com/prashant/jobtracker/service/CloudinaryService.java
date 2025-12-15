package com.prashant.jobtracker.service;

import org.springframework.web.multipart.MultipartFile;


public interface CloudinaryService {
    String uploadImage(MultipartFile file);
    String uploadPdf(MultipartFile file);
}
