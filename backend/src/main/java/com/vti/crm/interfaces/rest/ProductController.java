package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.product.*;
import com.vti.crm.infrastructure.external.CloudinaryService;
import com.vti.crm.interfaces.dto.request.ProductRequest;
import com.vti.crm.interfaces.dto.response.ProductResponse;
import com.vti.crm.interfaces.mapper.ProductWebMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final CreateProductUseCase createUseCase;
    private final GetProductByIdUseCase getByIdUseCase;
    private final GetAllProductsUseCase getAllUseCase;
    private final UpdateProductUseCase updateUseCase;
    private final DeleteProductUseCase deleteUseCase;
    private final CloudinaryService cloudinaryService;
    private final ProductWebMapper webMapper;

    @PostMapping(consumes = {"multipart/form-data"})
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse create(
            @Valid @RequestPart("product") ProductRequest request,
            // Sửa: Chỉ nhận 1 MultipartFile, không phải File hay List
            @RequestPart(value = "image", required = false) MultipartFile image) {

        return webMapper.toResponse(
                createUseCase.execute(
                        request.getProductCode(),
                        request.getName(),
                        request.getCategoryId(),
                        request.getUomId(),
                        request.getProductType(),
                        request.getBasePrice(),
                        request.getVatRate(),
                        request.getDepositOverride(),
                        image, // Truyền file đơn vào đây
                        request.getDescription()
                )
        );
    }
    @GetMapping("/{id}")
    public ProductResponse getById(@PathVariable Integer id) {
        return webMapper.toResponse(getByIdUseCase.execute(id));
    }

    @GetMapping
    public List<ProductResponse> getAll() {
        return getAllUseCase.execute()
                .stream()
                .map(webMapper::toResponse)
                .toList();
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ProductResponse update(
            @PathVariable Integer id,
            @Valid @RequestPart("product") ProductRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {

        // 1. Upload ảnh ở controller (kỹ thuật)
        String imageUrl = request.getImageUrl() != null ? null : null;
        if (images != null && !images.isEmpty()) {
            // TODO: Replace ảnh qua ReplaceImagesUseCase rồi lấy id ảnh đầu tiên
            // imageId = replaceImagesAndGetFirstId(id, images);
        }

        return webMapper.toResponse(
                updateUseCase.execute(
                        id,
                        request.getProductCode(),
                        request.getName(),
                        request.getCategoryId(),
                        request.getUomId(),
                        request.getProductType(),
                        request.getBasePrice(),
                        request.getVatRate(),
                        request.getDepositOverride(),
                        imageUrl,
                        request.getDescription()
                )
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        deleteUseCase.execute(id);
    }
}