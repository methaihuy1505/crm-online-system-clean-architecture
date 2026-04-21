package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.CustomerRank;
import com.vti.crm.infrastructure.persistence.entity.CustomerRankDbEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CustomerRankInfraMapper {
    CustomerRank toDomain(CustomerRankDbEntity entity);
    CustomerRankDbEntity toEntity(CustomerRank domain);
}