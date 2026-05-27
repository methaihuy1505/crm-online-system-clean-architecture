package com.vti.crm.infrastructure.persistence.specification;

import com.vti.crm.infrastructure.persistence.entity.UserDbEntity;
import com.vti.crm.interfaces.dto.request.user.UserFilterRequest;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;

public class UserSpecification {

    public static Specification<UserDbEntity> withFilter(UserFilterRequest filter) {
        return (root, query, criteriaBuilder) -> {
            var predicates = new java.util.ArrayList<Predicate>();

            // Tìm kiếm theo keyword (username, email, fullName)
            if (filter.getKeyword() != null && !filter.getKeyword().trim().isEmpty()) {
                String keyword = "%" + filter.getKeyword().toLowerCase() + "%";
                var keywordPredicate = criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("username")), keyword),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), keyword),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("fullName")), keyword)
                );
                predicates.add(keywordPredicate);
            }

            // Lọc theo status
            if (filter.getStatus() != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), filter.getStatus()));
            }

            // Lọc theo roleId
            if (filter.getRoleId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("roleId"), filter.getRoleId()));
            }

            // Nếu không có filter nào, trả về conjunction (always true)
            if (predicates.isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            // Kết hợp tất cả predicates với AND
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}

