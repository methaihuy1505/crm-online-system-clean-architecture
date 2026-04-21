package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.CustomerStatus;
import com.vti.crm.infrastructure.persistence.entity.CustomerStatusDbEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CustomerStatusInfraMapper {
    CustomerStatus toDomain(CustomerStatusDbEntity entity);
    CustomerStatusDbEntity toEntity(CustomerStatus domain);
}