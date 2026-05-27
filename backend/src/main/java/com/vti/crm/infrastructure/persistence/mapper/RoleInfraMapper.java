package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.Role;
import com.vti.crm.infrastructure.persistence.entity.RoleDbEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RoleInfraMapper {
    Role toDomain(RoleDbEntity entity);
    RoleDbEntity toEntity(Role domain);
}