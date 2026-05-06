package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.Customer;
import com.vti.crm.infrastructure.persistence.entity.CustomerDbEntity;
import com.vti.crm.infrastructure.persistence.entity.CustomerRankDbEntity;
import com.vti.crm.infrastructure.persistence.entity.CustomerStatusDbEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE, builder = @org.mapstruct.Builder(disableBuilder = true))
public interface CustomerInfraMapper {

    @Mapping(target = "statusId", source = "status.id")
    @Mapping(target = "rankId", source = "rank.id")
    Customer toDomain(CustomerDbEntity entity);

    @Mapping(target = "status", source = "statusId")
    @Mapping(target = "rank", source = "rankId")
    CustomerDbEntity toEntity(Customer domain);


    default CustomerStatusDbEntity mapStatus(Integer id) {
        if (id == null) return null;
        CustomerStatusDbEntity entity = new CustomerStatusDbEntity();
        entity.setId(id);
        return entity;
    }

    default CustomerRankDbEntity mapRank(Integer id) {
        if (id == null) return null;
        CustomerRankDbEntity entity = new CustomerRankDbEntity();
        entity.setId(id);
        return entity;
    }
}