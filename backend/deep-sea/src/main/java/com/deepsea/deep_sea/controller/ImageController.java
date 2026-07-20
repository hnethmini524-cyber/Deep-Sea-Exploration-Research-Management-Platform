package com.deepsea.deep_sea.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.deepsea.deep_sea.service.ImageService;
import java.io.IOException;
import java.util.Map;
@RestController
@RequestMapping("/api/v1/images")
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @GetMapping("/signature")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_RESEARCHER')")
    public ResponseEntity<Map<String, Object>> getUploadSignature() {

        Map<String, Object> signature =
                imageService.generateUploadSignature();

        return ResponseEntity.ok(signature);
    }
}
