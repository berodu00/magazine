package com.koreazinc.sabosystem.controller;

import com.koreazinc.sabosystem.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, String> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "category", defaultValue = "common") String category) {

        String fileUrl = fileService.storeFile(file, category);

        Map<String, String> response = new HashMap<>();
        response.put("url", fileUrl);

        return response;
    }
}
