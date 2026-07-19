package com.deepsea.deep_sea.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class ImageService {

    private final Cloudinary cloudinary;

    public ImageService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadImage(MultipartFile file) {

        long start = System.currentTimeMillis();

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Image file cannot be empty");
        }

        System.out.println(
            "📦 File size: " + file.getSize() + " bytes"
        );

        try {
            long cloudinaryStart = System.currentTimeMillis();

            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.emptyMap()
            );

            long cloudinaryDuration =
                    System.currentTimeMillis() - cloudinaryStart;

            System.out.println(
                "☁️ Cloudinary upload took: "
                + cloudinaryDuration
                + " ms"
            );

            String imageUrl = uploadResult
                    .get("secure_url")
                    .toString();

            System.out.println(
                "🏁 ImageService total time: "
                + (System.currentTimeMillis() - start)
                + " ms"
            );

            return imageUrl;

        } catch (IOException e) {
            System.err.println(
                "❌ Failed to read uploaded image: "
                + e.getMessage()
            );

            throw new RuntimeException(
                "Failed to process uploaded image",
                e
            );
        }
    }
}