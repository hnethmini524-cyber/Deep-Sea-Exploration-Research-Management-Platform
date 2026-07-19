package com.deepsea.deep_sea.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // 💡 Added for endpoint lockdown
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.deepsea.deep_sea.service.ImageService;

@RestController
@RequestMapping("/api/v1/images")
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping("/upload")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_RESEARCHER')")
    public ResponseEntity<String> uploadImage(
            @RequestParam("file") MultipartFile file) {

        long start = System.currentTimeMillis();

        System.out.println("📥 Controller received file: "
                + file.getOriginalFilename());

        String imageUrl = imageService.uploadImage(file);

        System.out.println("📤 Controller total time: "
                + (System.currentTimeMillis() - start) + " ms");

        return ResponseEntity.ok(imageUrl);
    }
}
