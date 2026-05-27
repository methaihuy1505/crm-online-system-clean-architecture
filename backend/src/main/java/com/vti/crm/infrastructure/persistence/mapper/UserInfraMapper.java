package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.User;
import com.vti.crm.infrastructure.persistence.entity.UserDbEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserInfraMapper {

    // Chiều Domain -> Entity: MapStruct tự động dùng các Getter của class User
    @Mapping(target = "role.id", source = "roleId")
    @Mapping(target = "branch.id", source = "branchId")
    @Mapping(target = "team.id", source = "teamId")
    UserDbEntity toDbEntity(User domain);

    // Chiều Entity -> Domain: Tự hướng dẫn MapStruct dùng Constructor
    default User toDomainEntity(UserDbEntity entity) {
        if (entity == null) {
            return null;
        }

        // Trích xuất ID từ các đối tượng quan hệ (nếu có)
        Integer roleId = entity.getRole() != null ? entity.getRole().getId() : null;
        Integer branchId = entity.getBranch() != null ? entity.getBranch().getId() : null;
        Integer teamId = entity.getTeam() != null ? entity.getTeam().getId() : null;

        // Chuyển đổi trạng thái từ String sang Enum
        User.Status status = null;
        if (entity.getStatus() != null) {
            try {
                status = User.Status.valueOf(entity.getStatus().toUpperCase());
            } catch (IllegalArgumentException e) {
                status = User.Status.ACTIVE; // Fallback mặc định
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