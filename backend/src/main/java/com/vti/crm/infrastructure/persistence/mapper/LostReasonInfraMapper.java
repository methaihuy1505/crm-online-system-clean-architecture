package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.LostReason;
import com.vti.crm.infrastructure.persistence.entity.LostReasonDbEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LostReasonInfraMapper {

    LostReasonDbEntity toDbEntity(LostReason domain);

    default LostReason toDomain(LostReasonDbEntity db) {
        if (db == null) return null;
        return new LostReason(db.getId(), db.getCode(), db.getName(), db.getDescription());
    }
}