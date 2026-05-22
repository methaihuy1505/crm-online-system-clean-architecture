package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.OpportunityStatus;
import com.vti.crm.infrastructure.persistence.entity.OpportunityStatusDbEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OpportunityStatusInfraMapper {

    @Mapping(source = "final", target = "isFinal")
    OpportunityStatusDbEntity toDbEntity(OpportunityStatus domain);

    default OpportunityStatus toDomain(OpportunityStatusDbEntity db) {
        if (db == null) return null;
        return new OpportunityStatus(
                db.getId(),
                db.getCode(),
                db.getName(),
                db.getIsFinal() != null ? db.getIsFinal() : false
        );
    }
}