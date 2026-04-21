package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.Contact;
import com.vti.crm.infrastructure.persistence.entity.ContactDbEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ContactInfraMapper {

    // Ánh xạ khóa ngoại customer_id
    @Mapping(target = "customerId", source = "customer.id")
    Contact toDomain(ContactDbEntity entity);

    @Mapping(target = "customer.id", source = "customerId")
    ContactDbEntity toEntity(Contact domain);
}