package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.BranchProvince;
import com.vti.crm.infrastructure.persistence.entity.BranchProvinceDbEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BranchProvinceInfraMapper {
    BranchProvince toDomain(BranchProvinceDbEntity entity);
    BranchProvinceDbEntity toEntity(BranchProvince domain);
}