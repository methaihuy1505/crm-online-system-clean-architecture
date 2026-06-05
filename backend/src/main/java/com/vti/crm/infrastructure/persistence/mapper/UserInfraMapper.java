package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.User;
import com.vti.crm.infrastructure.persistence.entity.BranchDbEntity;
import com.vti.crm.infrastructure.persistence.entity.RoleDbEntity;
import com.vti.crm.infrastructure.persistence.entity.TeamDbEntity;
import com.vti.crm.infrastructure.persistence.entity.UserDbEntity;
import jakarta.persistence.EntityManager;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class UserInfraMapper {

    @Autowired
    protected EntityManager entityManager;

    // Sử dụng expression để gọi hàm lấy Proxy (Reference) từ EntityManager
    @Mapping(target = "role", expression = "java(getRoleRef(domain.getRoleId()))")
    @Mapping(target = "branch", expression = "java(getBranchRef(domain.getBranchId()))")
    @Mapping(target = "team", expression = "java(getTeamRef(domain.getTeamId()))")
    public abstract UserDbEntity toDbEntity(User domain);

    // --- Các hàm hỗ trợ lấy Proxy Object (Không tốn Query SELECT) ---
    protected RoleDbEntity getRoleRef(Integer id) {
        return id != null ? entityManager.getReference(RoleDbEntity.class, id) : null;
    }

    protected BranchDbEntity getBranchRef(Integer id) {
        return id != null ? entityManager.getReference(BranchDbEntity.class, id) : null;
    }

    protected TeamDbEntity getTeamRef(Integer id) {
        return id != null ? entityManager.getReference(TeamDbEntity.class, id) : null;
    }

    // Chiều Entity -> Domain: Tự hướng dẫn MapStruct dùng Constructor
    public User toDomainEntity(UserDbEntity entity) {
        if (entity == null) {
            return null;
        }

        // Trích xuất ID từ các đối tượng quan hệ (nếu có)
        Integer roleId = entity.getRole() != null ? entity.getRole().getId() : null;
        Integer branchId = entity.getBranch() != null ? entity.getBranch().getId() : null;
        Integer teamId = entity.getTeam() != null ? entity.getTeam().getId() : null;

        // Chuyển đổi trạng thái từ String sang Enum
        User.Status status = User.Status.ACTIVE; // Fallback mặc định
        if (entity.getStatus() != null) {
            try {
                status = User.Status.valueOf(entity.getStatus().toUpperCase());
            } catch (IllegalArgumentException e) {
                // Bỏ qua, giữ fallback ACTIVE
            }
        }

        // Gọi Constructor dành cho việc lấy dữ liệu từ DB (có ID và thời gian)
        return new User(
                entity.getId(),
                entity.getUsername(),
                entity.getFullName(),
                entity.getPassword(),
                entity.getEmail(),
                entity.getPhone(),
                roleId,
                branchId,
                teamId,
                status,
                entity.getCreatedAt()
        );
    }
}