package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.Lead;
import com.vti.crm.infrastructure.persistence.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface LeadInfraMapper {

    @Mapping(target = "sourceId", source = "source.id")
    @Mapping(target = "campaignId", source = "campaign.id")
    @Mapping(target = "statusId", source = "status.id")
    Lead toDomain(LeadDbEntity entity);

    // Map thẳng vào target Object
    @Mapping(target = "source", source = "sourceId")
    @Mapping(target = "campaign", source = "campaignId")
    @Mapping(target = "status", source = "statusId")
    LeadDbEntity toEntity(Lead domain);

    default SourceDbEntity mapSource(Integer id) {
        if (id == null) return null;
        SourceDbEntity entity = new SourceDbEntity();
        entity.setId(id);
        return entity;
    }

    default CampaignDbEntity mapCampaign(Integer id) {
        if (id == null) return null;
        CampaignDbEntity entity = new CampaignDbEntity();
        entity.setId(id);
        return entity;
    }

    default LeadStatusDbEntity mapStatus(Integer id) {
        if (id == null) return null;
        LeadStatusDbEntity entity = new LeadStatusDbEntity();
        entity.setId(id);
        return entity;
    }
}