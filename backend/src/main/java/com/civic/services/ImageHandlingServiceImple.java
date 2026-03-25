package com.civic.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ImageHandlingServiceImple implements ImageHandlingService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Override
    public String uploadImage(MultipartFile imageFile) throws IOException {
        if (imageFile == null || imageFile.isEmpty()) {
            return null;
        }

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        
        Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // Return the accessible URL path
        return "/uploads/" + fileName;
    }

    @Override
    public void deleteImage(String imageUrl) {
        if (imageUrl != null && imageUrl.startsWith("/uploads/")) {
            String fileName = imageUrl.substring("/uploads/".length());
            Path filePath = Paths.get(uploadDir).resolve(fileName);
            try {
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
