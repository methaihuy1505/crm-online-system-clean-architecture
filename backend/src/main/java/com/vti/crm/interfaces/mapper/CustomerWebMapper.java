package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.Customer;
import com.vti.crm.infrastructure.persistence.entity.*;
import com.vti.crm.infrastructure.persistence.repository.branch.JpaBranchRepository;
import com.vti.crm.infrastructure.persistence.repository.campaign.JpaCampaignRepository;
import com.vti.crm.infrastructure.persistence.repository.customer.customer_rank.JpaCustomerRankRepository;
import com.vti.crm.infrastructure.persistence.repository.customer.customer_status.JpaCustomerStatusRepository;
import com.vti.crm.infrastructure.persistence.repository.province.JpaProvinceRepository;
import com.vti.crm.infrastructure.persistence.repository.source.JpaSourceRepository;
import com.vti.crm.infrastructure.persistence.repository.user.JpaUserRepository;
import com.vti.crm.interfaces.dto.response.customer.CustomerResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class CustomerWebMapper {

    @Autowired protected JpaCustomerStatusRepository statusRepo;
    @Autowired protected JpaCustomerRankRepository rankRepo;
    @Autowired protected JpaSourceRepository sourceRepo;
    @Autowired protected JpaCampaignRepository campaignRepo;
    @Autowired protected JpaBranchRepository branchRepo;
    @Autowired protected JpaProvinceRepository provinceRepo;
    @Autowired protected JpaUserRepository userRepo;

    @Mapping(target = "statusName", expression = "java(getStatusName(domain.getStatusId()))")
    @Mapping(target = "rankName", expression = "java(getRankName(domain.getRankId()))")
    @Mapping(target = "sourceName", expression = "java(getSourceName(domain.getSourceId()))")
    @Mapping(target = "campaignName", expression = "java(getCampaignName(domain.getCampaignId()))")
    @Mapping(target = "branchName", expression = "java(getBranchName(domain.getBranchId()))")
    @Mapping(target = "provinceName", expression = "java(getProvinceName(domain.getProvinceId()))")
    @Mapping(target = "assignedUserName", expression = "java(getUserFullName(domain.getAssignedUserId()))")
    public abstract CustomerResponse toResponse(Customer domain);

    // --- Các hàm Helper tra cứu từ Database ---

    protected String getStatusName(Integer id) {
        if (id == null) return null;
        return statusRepo.findById(id).map(CustomerStatusDbEntity::getName).orElse(null);
    }

    protected String getRankName(Integer id) {
        if (id == null) return null;
        return rankRepo.findById(id).map(CustomerRankDbEntity::getName).orElse(null);
    }

    protected String getSourceName(Integer id) {
        if (id == null) return null;
        return sourceRepo.findById(id).map(SourceDbEntity::getName).orElse(null);
    }

    protected String getCampaignName(Integer id) {
        if (id == null) return null;
        return campaignRepo.findById(id).map(CampaignDbEntity::getName).orElse(null);
    }

    protected String getBranchName(Integer id) {
        if (id == null) return null;
        return branchRepo.findById(id).map(BranchDbEntity::getName).orElse(null);
    }

    protected String getProvinceName(Integer id) {
        if (id == null) return null;
        return provinceRepo.findById(id).map(ProvinceDbEntity::getName).orElse(null);
    }

    protected String getUserFullName(Integer id) {
        if (id == null) return null;
        return userRepo.findById(id).map(UserDbEntity::getFullName).orElse(null);
    }
}