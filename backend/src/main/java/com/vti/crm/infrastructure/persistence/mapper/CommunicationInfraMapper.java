package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.CommunicationDetail;
import com.vti.crm.infrastructure.persistence.entity.CommunicationDetailDbEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CommunicationInfraMapper {

    // Dịch từ DB Entity sang Model thuần (Rehydrate)
    CommunicationDetail toDomain(CommunicationDetailDbEntity entity);

    // Dịch từ Model thuần sang DB Entity để lưu trữ (Persist)
    CommunicationDetailDbEntity toEntity(CommunicationDetail domain);
}