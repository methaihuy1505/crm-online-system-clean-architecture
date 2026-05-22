package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.productcategory.*;
import com.vti.crm.interfaces.dto.request.product.ProductCategoryRequest;
import com.vti.crm.interfaces.dto.response.product.ProductCategoryResponse;
import com.vti.crm.interfaces.mapper.ProductCategoryWebMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/product-categories")
@RequiredArgsConstructor
public class ProductCategoryController {

    private final CreateProductCategoryUseCase createUseCase;
    private final GetProductCategoryByIdUseCase getByIdUseCase;
    private final GetAllProductCategoriesUseCase getAllUseCase;
    private final UpdateProductCategoryUseCase updateUseCase;
    private final DeleteProductCategoryUseCase deleteUseCase;
    private final ProductCategoryWebMapper webMapper;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductCategoryResponse create(
            @Valid @RequestBody ProductCategoryRequest request) {
        return webMapper.toResponse(
                createUseCase.execute(request.getName(), request.getDescription())
        );
    }

    @GetMapping("/{id}")
    public ProductCategoryResponse getById(@PathVariable Integer id) {
        return webMapper.toResponse(getByIdUseCase.execute(id));
    }

    @GetMapping
    public List<ProductCategoryResponse> getAll() {
        return getAllUseCase.execute()
                .stream()
                .map(webMapper::toResponse)
                .toList();
    }

    @PutMapping("/{id}")
    public ProductCategoryResponse update(
            @PathVariable Integer id,
            @Valid @RequestBody ProductCategoryRequest request) {
        return webMapper.toResponse(
                updateUseCase.execute(id, request.getName(), request.getDescription())
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        deleteUseCase.execute(id);
    }
}