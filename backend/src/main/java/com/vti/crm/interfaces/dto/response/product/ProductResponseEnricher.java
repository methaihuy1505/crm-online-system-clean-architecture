package com.vti.crm.interfaces.dto.response.product;

import com.vti.crm.domain.model.Product;
import com.vti.crm.infrastructure.persistence.entity.ProductCategoryDbEntity;
import com.vti.crm.infrastructure.persistence.entity.UomDbEntity;
import com.vti.crm.infrastructure.persistence.repository.product.product_category.JpaProductCategoryRepository;
import com.vti.crm.infrastructure.persistence.repository.product.uom.JpaUomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProductResponseEnricher {

    private final JpaProductCategoryRepository jpaProductCategoryRepository;
    private final JpaUomRepository jpaUomRepository;

    // ── Single (dùng cho create / update / getById) ──────────────────────────
    public ProductResponse toResponse(Product domain) {
        String catName = domain.getCategoryID() == null ? "" :
                jpaProductCategoryRepository.findById(domain.getCategoryID())
                .map(ProductCategoryDbEntity::getName).orElse("");

        String uomName = domain.getUomID() == null ? "" :
                jpaUomRepository.findById(domain.getUomID())
                .map(UomDbEntity::getName).orElse("");

        return buildResponse(domain, catName, uomName);
    }

    // ── Batch (dùng cho getAll / search) — chỉ 2 query dù bao nhiêu product ──
    public List<ProductResponse> toResponses(List<Product> products) {
        Set<Integer> categoryIds = products.stream()
                .map(Product::getCategoryID)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Set<Integer> uomIds = products.stream()
                .map(Product::getUomID)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Map<Integer, String> categoryMap = jpaProductCategoryRepository.findAllById(categoryIds)
                .stream()
                .collect(Collectors.toMap(
                        ProductCategoryDbEntity::getId,
                        ProductCategoryDbEntity::getName
                ));

        Map<Integer, String> uomMap = jpaUomRepository.findAllById(uomIds)
                .stream()
                .collect(Collectors.toMap(
                        UomDbEntity::getId,
                        UomDbEntity::getName
                ));

        return products.stream()
                .map(domain -> buildResponse(
                        domain,
                        categoryMap.getOrDefault(domain.getCategoryID(), ""),
                        uomMap.getOrDefault(domain.getUomID(), "")
                ))
                .toList();
    }

    // ── Builder dùng chung ───────────────────────────────────────────────────
    private ProductResponse buildResponse(Product domain, String categoryName, String uomName) {
        return ProductResponse.builder()
                .id(domain.getId())
                .productCode(domain.getProductCode())
                .name(domain.getName())
                .categoryId(domain.getCategoryID())
                .categoryName(categoryName)
                .uomId(domain.getUomID())
                .uomName(uomName)
                .productType(domain.getProductType())
                .basePrice(domain.getBasePrice())
                .vatRate(domain.getVatRate())
                .depositOverride(domain.getDepositOverride())
                .imageUrl(domain.getImageUrl())
                .description(domain.getDescription())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }
}