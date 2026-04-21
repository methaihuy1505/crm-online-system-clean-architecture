package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.Lead;
import com.vti.crm.infrastructure.persistence.entity.LeadDbEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface LeadInfraMapper {
    // Tự động map IDs từ Entity sang Model (Vì Model chứa IDs thay vì Object Entity)
    @Mapping(target = "sourceId", source = "source.id")
    @Mapping(target = "campaignId", source = "campaign.id")
    @Mapping(target = "statusId", source = "status.id")
    Lead toDomain(LeadDbEntity entity);

    @Mapping(target = "source.id", source = "sourceId")
    @Mapping(target = "campaign.id", source = "campaignId")
    @Mapping(target = "status.id", source = "statusId")
    LeadDbEntity toEntity(Lead domain);
}