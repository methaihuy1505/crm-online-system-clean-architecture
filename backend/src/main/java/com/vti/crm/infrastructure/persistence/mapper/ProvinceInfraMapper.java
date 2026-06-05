package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.Province;
import com.vti.crm.infrastructure.persistence.entity.ProvinceDbEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ProvinceInfraMapper {
    Province toDomain(ProvinceDbEntity entity);
    ProvinceDbEntity toEntity(Province domain);
}