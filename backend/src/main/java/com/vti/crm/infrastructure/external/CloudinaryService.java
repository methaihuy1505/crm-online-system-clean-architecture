package com.vti.crm.infrastructure.external;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String upload(MultipartFile file) {
        try {
            Map<?, ?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "crm/products",
                            "resource_type", "image"
                    )
            );

            // Sử dụng String.valueOf để tránh lỗi null pointer/cast exception
            String url = String.valueOf(result.get("secure_url"));

            if (url == null || url.equals("null")) {
                throw new RuntimeException("Cloudinary không trả về secure_url: " + result);
            }

            System.out.println("DEBUG: Upload thành công, URL: " + url);
            return url;

        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image to Cloudinary", e);
        }
    }
    public void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File must not be empty");
        }
        String contentType = file.getContentType();
        if (contentType == null ||
                !(contentType.equals("image/jpeg") ||
                        contentType.equals("image/png") ||
                        contentType.equals("image/jpg") ||
                        contentType.equals("image/webp"))) {
            throw new RuntimeException("Only image files are allowed");
        }
    }
}