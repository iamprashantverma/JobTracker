package com.prashant.jobtracker.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.prashant.jobtracker.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;

    @Override
    public String uploadImage(MultipartFile file) {
        try {
            Map params = ObjectUtils.asMap(
                    "folder", "UserService/images"
            );

            Map uploadResult = cloudinary.uploader()
                    .upload(file.getBytes(), params);

            return uploadResult.get("secure_url").toString();

        } catch (IOException e) {
            log.error("Error while uploading image", e);
            throw new RuntimeException("Image upload failed");
        }
    }

    // Upload PDF
    @Override
    public String uploadPdf(MultipartFile file) {
        try {
            Map params = ObjectUtils.asMap(
                    "folder", "UserService/pdfs",
                    "resource_type", "raw"
            );

            Map uploadResult = cloudinary.uploader()
                    .upload(file.getBytes(), params);

            return uploadResult.get("secure_url").toString();

        } catch (IOException e) {
            log.error("Error while uploading PDF", e);
            throw new RuntimeException("PDF upload failed");
        }
    }
}
