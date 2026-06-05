package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.Branch;
import com.vti.crm.infrastructure.persistence.entity.BranchDbEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BranchInfraMapper {
    Branch toDomain(BranchDbEntity entity);
    BranchDbEntity toEntity(Branch domain);
}