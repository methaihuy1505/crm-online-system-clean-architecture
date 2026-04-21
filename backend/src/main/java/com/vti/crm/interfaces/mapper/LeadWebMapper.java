package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.Lead;
import com.vti.crm.infrastructure.persistence.entity.CampaignDbEntity;
import com.vti.crm.infrastructure.persistence.entity.LeadStatusDbEntity;
import com.vti.crm.infrastructure.persistence.entity.SourceDbEntity;
import com.vti.crm.infrastructure.persistence.repository.*;
import com.vti.crm.interfaces.dto.response.LeadResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class LeadWebMapper {

    @Autowired
    protected JpaLeadStatusRepository statusRepo;

    @Autowired
    protected JpaSourceRepository sourceRepo;

    @Autowired
    protected JpaCampaignRepository campaignRepo;

    // Gắn biểu thức Java để MapStruct tự gọi hàm tra cứu tên
    @Mapping(target = "statusName", expression = "java(getStatusName(domain.getStatusId()))")
    @Mapping(target = "sourceName", expression = "java(getSourceName(domain.getSourceId()))")
    @Mapping(target = "campaignName", expression = "java(getCampaignName(domain.getCampaignId()))")
    public abstract LeadResponse toResponse(Lead domain);

    // --- Các hàm Helper tra cứu từ Database ---

    protected String getStatusName(Integer statusId) {
        if (statusId == null) return null;
        return statusRepo.findById(statusId).map(LeadStatusDbEntity::getName).orElse(null);
    }

    protected String getSourceName(Integer sourceId) {
        if (sourceId == null) return null;
        return sourceRepo.findById(sourceId).map(SourceDbEntity::getName).orElse(null);
    }

    protected String getCampaignName(Integer campaignId) {
        if (campaignId == null) return null;
        return campaignRepo.findById(campaignId).map(CampaignDbEntity::getName).orElse(null);
    }
}