package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.Customer;
import com.vti.crm.infrastructure.persistence.entity.CustomerDbEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CustomerInfraMapper {

    // Map từ Entity (DB) lên Model (Domain)
    @Mapping(target = "statusId", source = "status.id")
    @Mapping(target = "rankId", source = "rank.id")
    Customer toDomain(CustomerDbEntity entity);

    // Map ngược từ Model (Domain) xuống Entity (DB) để lưu
    @Mapping(target = "status.id", source = "statusId")
    @Mapping(target = "rank.id", source = "rankId")
    CustomerDbEntity toEntity(Customer domain);
}