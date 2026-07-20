package com.deepsea.deep_sea.service;

import java.io.IOException;
import java.util.HashMap;
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

    public Map<String, Object> generateUploadSignature() {

        long timestamp = System.currentTimeMillis() / 1000;

        Map<String, Object> params = new HashMap<>();

        params.put("timestamp", timestamp);

        String signature = cloudinary.apiSignRequest(
                params,
                cloudinary.config.apiSecret
        );

        Map<String, Object> response = new HashMap<>();

        response.put("signature", signature);
        response.put("timestamp", timestamp);
        response.put("apiKey", cloudinary.config.apiKey);
        response.put("cloudName", cloudinary.config.cloudName);

        return response;
    }
}