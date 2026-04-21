package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.Source;
import com.vti.crm.infrastructure.persistence.entity.SourceDbEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SourceInfraMapper {
    Source toDomain(SourceDbEntity entity);
    SourceDbEntity toEntity(Source domain);
}