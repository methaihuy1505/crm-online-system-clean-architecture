package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.User;
import com.vti.crm.infrastructure.persistence.entity.UserDbEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserInfraMapper {
    UserDbEntity toDbEntity(User domainEntity);
    default User toDomainEntity(UserDbEntity dbEntity){
        if (dbEntity == null) {
            return null;
        }

        return new User(
                dbEntity.getId(),
                dbEntity.getUsername(),
                dbEntity.getPassword(),
                dbEntity.getFullName(),
                dbEntity.getEmail(),
                dbEntity.getPhone(),
                dbEntity.getStatus(),
                dbEntity.getCreatedAt()
        );
    }
}
