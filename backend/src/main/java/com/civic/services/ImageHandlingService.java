package com.civic.services;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface ImageHandlingService {
    String uploadImage(MultipartFile imageFile) throws IOException;
    void deleteImage(String imageUrl);
}
