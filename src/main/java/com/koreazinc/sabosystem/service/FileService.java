package com.koreazinc.sabosystem.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("jpg", "jpeg", "png", "gif");

    public String storeFile(MultipartFile file, String category) {
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        validateFileExtension(originalFilename);

        try {
            // Directory structure: uploads/{category}/{year}/{month}/
            LocalDate now = LocalDate.now();
            String year = String.valueOf(now.getYear());
            String month = String.format("%02d", now.getMonthValue());
            Path uploadPath = Paths.get(uploadDir, category, year, month).toAbsolutePath().normalize();

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename: {category}_{timestamp}_{uuid}.{ext}
            String extension = getFileExtension(originalFilename);
            String newFilename = String.format("%s_%d_%s.%s",
                    category,
                    System.currentTimeMillis(),
                    UUID.randomUUID().toString().substring(0, 8),
                    extension);

            Path targetLocation = uploadPath.resolve(newFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Return relative URL for frontend:
            // /uploads/{category}/{year}/{month}/{filename}
            return String.format("/uploads/%s/%s/%s/%s", category, year, month, newFilename);

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFilename + ". Please try again!", ex);
        }
    }

    private void validateFileExtension(String filename) {
        String extension = getFileExtension(filename);
        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new RuntimeException("Invalid file extension. Only " + ALLOWED_EXTENSIONS + " are allowed.");
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf(".") == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
}
