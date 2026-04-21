package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.Contact;
import com.vti.crm.infrastructure.persistence.entity.CustomerDbEntity;
import com.vti.crm.infrastructure.persistence.repository.JpaCustomerRepository;
import com.vti.crm.interfaces.dto.response.ContactResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class ContactWebMapper {

    @Autowired
    protected JpaCustomerRepository customerRepo;

    @Mapping(target = "customerName", expression = "java(getCustomerName(domain.getCustomerId()))")
    @Mapping(target = "fullName", expression = "java(getFullName(domain))")
    public abstract ContactResponse toResponse(Contact domain);

    protected String getCustomerName(Integer customerId) {
        if (customerId == null) return null;
        return customerRepo.findById(customerId).map(CustomerDbEntity::getName).orElse(null);
    }

    // Logic nối tên hiển thị y như hàm mapToResponse ở Service cũ
    protected String getFullName(Contact domain) {
        return (domain.getLastName() != null ? domain.getLastName() + " " : "") + domain.getFirstName();
    }
}