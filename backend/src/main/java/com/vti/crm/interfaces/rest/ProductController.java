package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.product.*;
import com.vti.crm.domain.model.ProductFilter;
import com.vti.crm.interfaces.dto.request.product.ProductRequest;
import com.vti.crm.interfaces.dto.response.product.ProductResponse;
import com.vti.crm.interfaces.dto.response.product.ProductResponseEnricher;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
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
    private final SearchProductsUseCase searchProductsUseCase;
    private final ProductResponseEnricher enricher;

    @PostMapping(consumes = {"multipart/form-data"})
    @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse create(
            @Valid @RequestPart("product") ProductRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        return enricher.toResponse(
                createUseCase.execute(
                        request.getProductCode(),
                        request.getName(),
                        request.getCategoryId(),
                        request.getUomId(),
                        request.getProductType(),
                        request.getBasePrice(),
                        request.getVatRate(),
                        request.getDepositOverride(),
                        image,
                        request.getDescription()
                )
        );
    }

    @GetMapping("/{id:\\d+}")
    public ProductResponse getById(@PathVariable Integer id) {
        return enricher.toResponse(getByIdUseCase.execute(id));
    }

    @GetMapping
    public List<ProductResponse> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) String uomId,
            @RequestParam(required = false) String productType,
            @RequestParam(required = false) String sort) {

        ProductFilter filter = new ProductFilter(
                search,
                parseIds(categoryId),
                parseIds(uomId),
                productType,
                sort
        );

        // toResponses() — batch load, chỉ 2 query DB
        return enricher.toResponses(getProductsWithFilterUseCase.execute(filter));
    }

    @PutMapping(value = "/{id:\\d+}", consumes = {"multipart/form-data"})
    public ProductResponse update(
            @PathVariable Integer id,
            @Valid @RequestPart("product") ProductRequest request,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        return enricher.toResponse(
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
                        image,
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
    public ResponseEntity<List<ProductResponse>> search(@RequestParam("keyword") String keyword) {
        try {
            // toResponses() — batch load, chỉ 2 query DB
            return ResponseEntity.ok(
                    enricher.toResponses(searchProductsUseCase.execute(keyword))
            );
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ── Helper ───────────────────────────────────────────────────────────────
    private List<Integer> parseIds(String param) {
        if (param == null || param.isBlank()) return List.of();
        return Arrays.stream(param.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(Integer::parseInt)
                .toList();
    }
}