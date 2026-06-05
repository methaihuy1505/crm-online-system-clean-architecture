package com.vti.crm.infrastructure.persistence.specification;

import com.vti.crm.domain.model.UserFilter;
import com.vti.crm.infrastructure.persistence.entity.UserDbEntity;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class UserSpecification {
    public static Specification<UserDbEntity> withFilter(UserFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Lọc theo keyword (Tìm tương đối)
            if (filter.getKeyword() != null && !filter.getKeyword().isEmpty()) {
                String pattern = "%" + filter.getKeyword().toLowerCase() + "%";
                Predicate nameLike = cb.like(cb.lower(root.get("fullName")), pattern);
                Predicate usernameLike = cb.like(cb.lower(root.get("username")), pattern);
                Predicate emailLike = cb.like(cb.lower(root.get("email")), pattern);
                predicates.add(cb.or(nameLike, usernameLike, emailLike));
            }

            // 2. Lọc theo trạng thái
            if (filter.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), filter.getStatus().name()));
            }

            // 3. Lọc theo ID vai trò (FIX: trỏ qua object role)
            if (filter.getRoleId() != null) {
                // Nếu UserDbEntity có thuộc tính là `role`, ta dùng root.get("role").get("id")
                predicates.add(cb.equal(root.get("role").get("id"), filter.getRoleId()));
            }

            // 4. Lọc theo danh sách Branch (FIX: trỏ qua object branch)
            if (filter.getBranchIds() != null && !filter.getBranchIds().isEmpty()) {
                CriteriaBuilder.In<Integer> inBranch = cb.in(root.get("branch").get("id"));
                for (Integer id : filter.getBranchIds()) {
                    inBranch.value(id);
                }
                predicates.add(inBranch);
            }

            // 5. Lọc theo danh sách Team (FIX: trỏ qua object team)
            if (filter.getTeamIds() != null && !filter.getTeamIds().isEmpty()) {
                CriteriaBuilder.In<Integer> inTeam = cb.in(root.get("team").get("id"));
                for (Integer id : filter.getTeamIds()) {
                    inTeam.value(id);
                }
                predicates.add(inTeam);
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}