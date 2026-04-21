package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.LeadInterest;
import com.vti.crm.infrastructure.persistence.entity.LeadInterestDbEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface LeadInterestInfraMapper {

    // Map từ DB Entity lên Model thuần
    @Mapping(target = "leadId", source = "lead.id")
    LeadInterest toDomain(LeadInterestDbEntity entity);

    // Map từ Model thuần xuống DB Entity
    @Mapping(target = "lead.id", source = "leadId")
    LeadInterestDbEntity toEntity(LeadInterest domain);
}