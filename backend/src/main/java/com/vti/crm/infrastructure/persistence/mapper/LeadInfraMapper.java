package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.Lead;
import com.vti.crm.infrastructure.persistence.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface LeadInfraMapper {

    // ===================================================================================
    // 1. CHIỀU TỪ ENTITY (DB) -> DOMAIN (NGHIỆP VỤ)
    // Tự tay hướng dẫn MapStruct gọi Constructor có đầy đủ ID phục dựng từ DB
    // ===================================================================================
    default Lead toDomain(LeadDbEntity entity) {
        if (entity == null) {
            return null;
        }

        // Bóc tách ID từ các Object quan hệ
        Integer provinceId = entity.getProvince() != null ? entity.getProvince().getId() : null;
        Integer branchId = entity.getBranch() != null ? entity.getBranch().getId() : null;
        Integer sourceId = entity.getSource() != null ? entity.getSource().getId() : null;
        Integer campaignId = entity.getCampaign() != null ? entity.getCampaign().getId() : null;
        Integer statusId = entity.getStatus() != null ? entity.getStatus().getId() : null;
        Integer assignedTo = entity.getAssignedToUser() != null ? entity.getAssignedToUser().getId() : null;
        Integer createdBy = entity.getCreatedByUser() != null ? entity.getCreatedByUser().getId() : null;
        Integer updatedBy = entity.getUpdatedByUser() != null ? entity.getUpdatedByUser().getId() : null;

        // Gọi Constructor 24 tham số của Lead
        return new Lead(
                entity.getId(),
                entity.getFullName(),
                entity.getCompanyName(),
                entity.getPhone(),
                entity.getEmail(),
                entity.getWebsite(),
                entity.getTaxCode(),
                entity.getCitizenId(),
                entity.getAddress(),
                provinceId,
                branchId,
                sourceId,
                campaignId,
                statusId,
                entity.getExpectedRevenue(),
                entity.getDescription(),
                entity.getTotalCalls(),
                entity.getTotalEmails(),
                entity.getTotalMeetings(),
                assignedTo,
                createdBy,
                updatedBy,
                entity.getCreatedAt(),
                entity.getDeletedAt()
        );
    }

    // ===================================================================================
    // 2. CHIỀU TỪ DOMAIN (NGHIỆP VỤ) -> ENTITY (DB)
    // Chiều này MapStruct tự động làm được vì Entity của bạn có hàm Setter
    // ===================================================================================
    @Mapping(target = "source", source = "sourceId")
    @Mapping(target = "campaign", source = "campaignId")
    @Mapping(target = "status", source = "statusId")
    @Mapping(target = "province", source = "provinceId")
    @Mapping(target = "branch", source = "branchId")
    @Mapping(target = "assignedToUser", source = "assignedTo")
    @Mapping(target = "createdByUser", source = "createdBy")
    @Mapping(target = "updatedByUser", source = "updatedBy")
    LeadDbEntity toEntity(Lead domain);

    // ===================================================================================
    // 3. CÁC HÀM HELPER: TẠO STUB ENTITY CHỈ TỪ ID (GIÚP TỐI ƯU HIBERNATE)
    // ===================================================================================

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

    default ProvinceDbEntity mapProvince(Integer id) {
        if (id == null) return null;
        ProvinceDbEntity entity = new ProvinceDbEntity();
        entity.setId(id);
        return entity;
    }

    default BranchDbEntity mapBranch(Integer id) {
        if (id == null) return null;
        BranchDbEntity entity = new BranchDbEntity();
        entity.setId(id);
        return entity;
    }

    default UserDbEntity mapUser(Integer id) {
        if (id == null) return null;
        UserDbEntity entity = new UserDbEntity();
        entity.setId(id);
        return entity;
    }
}