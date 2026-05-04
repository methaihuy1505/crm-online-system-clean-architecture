package com.vti.crm.infrastructure.persistence.specification;

import com.vti.crm.domain.model.ProductFilter;
import com.vti.crm.infrastructure.persistence.entity.ProductDbEntity;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {

    public static Specification<ProductDbEntity> withFilter(ProductFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Chỉ lấy record chưa bị xóa
            predicates.add(cb.equal(root.get("isDeleted"), false));

            // Filter categoryIds
            if (!filter.getCategoryIds().isEmpty()) {
                predicates.add(root.get("categoryID").in(filter.getCategoryIds()));
            }

            // Filter uomIds
            if (!filter.getUomIds().isEmpty()) {
                predicates.add(root.get("uomID").in(filter.getUomIds()));
            }

            // Filter productType
            if (filter.getProductType() != null && !filter.getProductType().isBlank()) {
                predicates.add(cb.equal(
                        root.get("productType"),
                        filter.getProductType()
                ));
            }

            // Sort
            if (filter.getSort() != null) {
                switch (filter.getSort()) {
                    case "price_asc"  -> query.orderBy(cb.asc(root.get("basePrice")));
                    case "price_desc" -> query.orderBy(cb.desc(root.get("basePrice")));
                    case "name_asc"   -> query.orderBy(cb.asc(root.get("name")));
                    case "name_desc"  -> query.orderBy(cb.desc(root.get("name")));
                    default           -> query.orderBy(cb.asc(root.get("id")));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}