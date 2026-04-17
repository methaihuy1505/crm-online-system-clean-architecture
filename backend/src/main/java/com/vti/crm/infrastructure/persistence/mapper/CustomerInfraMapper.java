package com.vti.crm.infrastructure.persistence.mapper;


import com.vti.crm.domain.model.Customer;
import com.vti.crm.infrastructure.persistence.entity.CustomerDbEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CustomerInfraMapper {
    CustomerDbEntity toDbEntity(Customer domainEntity);

    default Customer toDomainEntity(CustomerDbEntity dbEntity) {
        if (dbEntity == null) return null;
        return new Customer(
                dbEntity.getId(),
                dbEntity.getFullName(),
                dbEntity.getEmail(),
                dbEntity.getPhone(),
                dbEntity.getStatus()
        );
    }
}
