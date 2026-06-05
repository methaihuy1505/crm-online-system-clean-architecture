package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.Lead;
import com.vti.crm.domain.repository.ILeadInterestRepository;
import com.vti.crm.infrastructure.persistence.entity.*;
import com.vti.crm.infrastructure.persistence.repository.branch.JpaBranchRepository;
import com.vti.crm.infrastructure.persistence.repository.campaign.JpaCampaignRepository;
import com.vti.crm.infrastructure.persistence.repository.lead.lead_status.JpaLeadStatusRepository;
import com.vti.crm.infrastructure.persistence.repository.province.JpaProvinceRepository;
import com.vti.crm.infrastructure.persistence.repository.source.JpaSourceRepository;
import com.vti.crm.infrastructure.persistence.repository.user.JpaUserRepository;
import com.vti.crm.interfaces.dto.response.lead.LeadResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class LeadWebMapper {

    @Autowired
    protected JpaLeadStatusRepository statusRepo;

    @Autowired
    protected JpaSourceRepository sourceRepo;

    @Autowired
    protected JpaCampaignRepository campaignRepo;

    @Autowired
    protected JpaProvinceRepository provinceRepo;

    @Autowired
    protected JpaBranchRepository branchRepo;

    @Autowired
    protected JpaUserRepository userRepo;

    @Autowired
    protected ILeadInterestRepository leadInterestRepo;

    // --- Mappings ---
    @Mapping(target = "statusName", expression = "java(getStatusName(domain.getStatusId()))")
    @Mapping(target = "sourceName", expression = "java(getSourceName(domain.getSourceId()))")
    @Mapping(target = "campaignName", expression = "java(getCampaignName(domain.getCampaignId()))")
    @Mapping(target = "provinceName", expression = "java(getProvinceName(domain.getProvinceId()))")
    @Mapping(target = "branchName", expression = "java(getBranchName(domain.getBranchId()))")
    @Mapping(target = "assignedToName", expression = "java(getUserFullName(domain.getAssignedTo()))")
    @Mapping(target = "createdByName", expression = "java(getUserFullName(domain.getCreatedBy()))")
    @Mapping(target = "updatedByName", expression = "java(getUserFullName(domain.getUpdatedBy()))")
    @Mapping(target = "productInterestIds", expression = "java(getProductInterestIds(domain.getId()))")
    public abstract LeadResponse toResponse(Lead domain);

    // --- Các hàm Helper tra cứu từ Database ---

    protected List<Integer> getProductInterestIds(Integer leadId) {
        if (leadId == null) return new ArrayList<>();
        return leadInterestRepo.findProductIdsByLeadId(leadId);
    }

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

    protected String getProvinceName(Integer provinceId) {
        if (provinceId == null) return null;
        return provinceRepo.findById(provinceId).map(ProvinceDbEntity::getName).orElse(null);
    }

    protected String getBranchName(Integer branchId) {
        if (branchId == null) return null;
        return branchRepo.findById(branchId).map(BranchDbEntity::getName).orElse(null);
    }

    protected String getUserFullName(Integer userId) {
        if (userId == null) return null;
        // Giả sử field tên trong UserDbEntity của bạn là fullName
        return userRepo.findById(userId).map(UserDbEntity::getFullName).orElse(null);
    }
}