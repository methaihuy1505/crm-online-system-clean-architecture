package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.Customer;
import com.vti.crm.infrastructure.persistence.entity.CustomerRankDbEntity;
import com.vti.crm.infrastructure.persistence.entity.CustomerStatusDbEntity;
import com.vti.crm.infrastructure.persistence.repository.JpaCustomerRankRepository;
import com.vti.crm.infrastructure.persistence.repository.JpaCustomerStatusRepository;
import com.vti.crm.interfaces.dto.response.CustomerResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class CustomerWebMapper {

    @Autowired
    protected JpaCustomerStatusRepository statusRepo;
    @Autowired
    protected JpaCustomerRankRepository rankRepo;

    @Mapping(target = "statusName", expression = "java(getStatusName(domain.getStatusId()))")
    @Mapping(target = "rankName", expression = "java(getRankName(domain.getRankId()))")
    public abstract CustomerResponse toResponse(Customer domain);

    protected String getStatusName(Integer statusId) {
        if (statusId == null) return null;
        return statusRepo.findById(statusId).map(CustomerStatusDbEntity::getName).orElse(null);
    }

    protected String getRankName(Integer rankId) {
        if (rankId == null) return null;
        return rankRepo.findById(rankId).map(CustomerRankDbEntity::getName).orElse(null);
    }
}