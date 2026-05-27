package com.vti.crm.infrastructure.persistence.specification;

import com.vti.crm.domain.model.OpportunityFilter;
import com.vti.crm.infrastructure.persistence.entity.OpportunityDbEntity;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class OpportunitySpecification {

    public static Specification<OpportunityDbEntity> withFilter(OpportunityFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Search theo name HOẶC opportunityCode
            if (filter.getSearch() != null && !filter.getSearch().isBlank()) {
                String pattern = "%" + filter.getSearch().trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), pattern),
                        cb.like(cb.lower(root.get("opportunityCode")), pattern)
                ));
            }
            predicates.add(root.get("deletedAt").isNull());
            // Filter theo stageIds → field "stage" trong entity
            if (!filter.getStageIds().isEmpty()) {
                predicates.add(root.get("stage").in(filter.getStageIds()));
            }

            // Filter theo statusIds → field "status" trong entity
            if (!filter.getStatusIds().isEmpty()) {
                predicates.add(root.get("status").in(filter.getStatusIds()));
            }

            // Filter theo reasonIds → field "lostReason" trong entity
            if (!filter.getReasonIds().isEmpty()) {
                predicates.add(root.get("lostReason").in(filter.getReasonIds()));
            }

            // Sort theo depositAmount
            if ("totalAmount_asc".equalsIgnoreCase(filter.getSort())) {
                query.orderBy(cb.asc(root.get("totalAmount")));
            } else if ("totalAmount_desc".equalsIgnoreCase(filter.getSort())) {
                query.orderBy(cb.desc(root.get("totalAmount")));
            }
            if ("prob_desc".equalsIgnoreCase(filter.getSort())) {
                query.orderBy(cb.desc(root.get("probability")));
            }
            else if ("prob_asc".equalsIgnoreCase(filter.getSort())) {
                query.orderBy(cb.asc(root.get("probability")));
            }
            if ("name_desc".equalsIgnoreCase(filter.getSort())) {
                query.orderBy(cb.desc(root.get("name")));
            }
            else if ("name_asc".equalsIgnoreCase(filter.getSort())) {
                query.orderBy(cb.asc(root.get("name")));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}