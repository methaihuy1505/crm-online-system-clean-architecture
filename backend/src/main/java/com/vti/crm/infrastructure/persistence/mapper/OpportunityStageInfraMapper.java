package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.OpportunityStage;
import com.vti.crm.infrastructure.persistence.entity.OpportunityStageDbEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OpportunityStageInfraMapper {
    @Mapping(source = "closed", target = "isClosed")
    OpportunityStageDbEntity toDbEntity(OpportunityStage domain);

    default OpportunityStage toDomain(OpportunityStageDbEntity db) {
        if (db == null) return null;
        return new OpportunityStage(
                db.getId(),
                db.getName(),
                db.getProbabilityDefault(),
                db.getSortOrder(),
                db.getIsClosed() != null ? db.getIsClosed() : false
        );
    }
}