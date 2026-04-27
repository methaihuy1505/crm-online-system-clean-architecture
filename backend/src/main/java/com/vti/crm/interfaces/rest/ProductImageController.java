package com.vti.crm.interfaces.rest;

import com.vti.crm.interfaces.dto.response.ProductImageResponseDTO;
import com.vti.crm.application.usecases.productimage.*;
import com.vti.crm.infrastructure.external.CloudinaryService;
import com.vti.crm.interfaces.mapper.ProductImageWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/product-images")
@RequiredArgsConstructor
public class ProductImageController {

    private final UploadMultipleImagesUseCase uploadMultipleImagesUseCase;
    private final GetImagesByProductUseCase getImagesByProductUseCase;
    private final DeleteImageUseCase deleteImageUseCase;
    private final ReplaceImagesUseCase replaceImagesUseCase;
    private final CloudinaryService cloudinaryService;
    private final ProductImageWebMapper webMapper;

    // ============ UPLOAD MULTIPLE ============
    @PostMapping("/upload-multiple/{productId}")
    public ResponseEntity<List<ProductImageResponseDTO>> uploadMultiple(
            @PathVariable Integer productId,
            @RequestParam("files") List<MultipartFile> files) {

        List<String> imageUrls = files.stream()
                .map(file -> {
                    cloudinaryService.validateFile(file);
                    return cloudinaryService.upload(file);
                })
                .toList();

        List<ProductImageResponseDTO> response = uploadMultipleImagesUseCase
                .execute(productId, imageUrls)
                .stream()
                .map(webMapper::toResponse)
                .toList();

        return ResponseEntity.ok(response);
    }

    // ============ GET BY PRODUCT ============
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductImageResponseDTO>> getByProduct(
            @PathVariable Integer productId) {

        List<ProductImageResponseDTO> response = getImagesByProductUseCase
                .execute(productId)
                .stream()
                .map(webMapper::toResponse)
                .toList();

        return ResponseEntity.ok(response);
    }

    // ============ DELETE IMAGE ============
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable Integer id) {
        deleteImageUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }

    // ============ REPLACE IMAGES ============
    @PutMapping("/replace/{productId}")
    public ResponseEntity<List<ProductImageResponseDTO>> replaceImages(
            @PathVariable Integer productId,
            @RequestParam("files") List<MultipartFile> files) {

        List<String> imageUrls = files.stream()
                .map(file -> {
                    cloudinaryService.validateFile(file);
                    return cloudinaryService.upload(file);
                })
                .toList();

        List<ProductImageResponseDTO> response = replaceImagesUseCase
                .execute(productId, imageUrls)
                .stream()
                .map(webMapper::toResponse)
                .toList();

        return ResponseEntity.ok(response);
    }
}