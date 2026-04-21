package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.Campaign;
import com.vti.crm.infrastructure.persistence.entity.CampaignDbEntity;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CampaignInfraMapper {

    // MapStruct sẽ gọi public Campaign(id, name, description...)
    Campaign toDomain(CampaignDbEntity entity);

    // Map ngược lại xuống entity (Entity có setter/builder thì dễ rồi)
    CampaignDbEntity toEntity(Campaign domain);
}