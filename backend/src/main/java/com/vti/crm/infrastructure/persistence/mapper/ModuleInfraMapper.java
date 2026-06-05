package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.Module;
import com.vti.crm.infrastructure.persistence.entity.ModuleDbEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ModuleInfraMapper {
    Module toDomain(ModuleDbEntity entity);
    ModuleDbEntity toEntity(Module domain);
}
