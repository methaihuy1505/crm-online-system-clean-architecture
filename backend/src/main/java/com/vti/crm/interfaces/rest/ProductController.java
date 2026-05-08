package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.product.*;
import com.vti.crm.domain.model.ProductFilter;
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
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final CreateProductUseCase createUseCase;
    private final GetProductByIdUseCase getByIdUseCase;
    private final UpdateProductUseCase updateUseCase;
    private final DeleteProductUseCase deleteUseCase;
    private final GetProductsWithFilterUseCase getProductsWithFilterUseCase;
    private final ProductWebMapper webMapper;
    private final SearchProductsUseCase searchProductsUseCase;

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
    @GetMapping("/{id:\\d+}")
    public ProductResponse getById(@PathVariable Integer id) {
        return webMapper.toResponse(getByIdUseCase.execute(id));
    }

    @GetMapping
    public List<ProductResponse> getAll(
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) String uomId,
            @RequestParam(required = false) String productType,
            @RequestParam(required = false) String sort) {

        // Parse categoryId="1,2,6" → List<Integer>
        List<Integer> categoryIds = parseIds(categoryId);
        List<Integer> uomIds      = parseIds(uomId);

        ProductFilter filter = new ProductFilter(categoryIds, uomIds, productType, sort);

        return getProductsWithFilterUseCase.execute(filter)
                .stream()
                .map(webMapper::toResponse)
                .toList();
    }

    private List<Integer> parseIds(String param) {
        if (param == null || param.isBlank()) return List.of();
        return Arrays.stream(param.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(Integer::parseInt)
                .toList();
    }

    @PutMapping(value = "/{id:\\d+}", consumes = {"multipart/form-data"})
    public ProductResponse update(
            @PathVariable Integer id,
            @Valid @RequestPart("product") ProductRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) {

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
                        image, // SỬA: truyền file thay vì imageUrl
                        request.getDescription()
                )
        );
    }

    @DeleteMapping("/{id:\\d+}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        deleteUseCase.execute(id);
    }

    @GetMapping("/search")
    public org.springframework.http.ResponseEntity<List<ProductResponse>> search(@RequestParam("keyword") String keyword) {
        try {
            List<ProductResponse> responses = searchProductsUseCase.execute(keyword)
                    .stream()
                    .map(webMapper::toResponse)
                    .toList();
            return org.springframework.http.ResponseEntity.ok(responses);
        } catch (Exception e) {
            e.printStackTrace(); // In log ra console backend để xem lỗi cụ thể ở dòng nào
            return org.springframework.http.ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}