package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.Permission;
import com.vti.crm.infrastructure.persistence.entity.PermissionDbEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PermissionInfraMapper {
    Permission toDomain(PermissionDbEntity entity);
    PermissionDbEntity toEntity(Permission domain);
}
