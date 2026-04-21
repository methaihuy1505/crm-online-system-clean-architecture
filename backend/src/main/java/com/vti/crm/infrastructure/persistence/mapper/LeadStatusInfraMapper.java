package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.LeadStatus;
import com.vti.crm.infrastructure.persistence.entity.LeadStatusDbEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface LeadStatusInfraMapper {
    LeadStatus toDomain(LeadStatusDbEntity entity);
    LeadStatusDbEntity toEntity(LeadStatus domain);
}