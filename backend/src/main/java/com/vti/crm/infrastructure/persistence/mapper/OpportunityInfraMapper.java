package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.Opportunity;
import com.vti.crm.infrastructure.persistence.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OpportunityInfraMapper {

    OpportunityDbEntity toDbEntity(Opportunity domain);

    default Opportunity toDomain(OpportunityDbEntity db) {
        if (db == null) return null;
        return new Opportunity.OpportunityBuilder()
                .id(db.getId())
                .opportunityCode(db.getOpportunityCode())
                .name(db.getName())
                .customerId(db.getCustomerId())
                .campaignId(db.getCampaignId())
                .stage(db.getStage() != null ? db.getStage() : null)
                .status(db.getStatus() != null ? db.getStatus() : null)
                .lostReason(db.getLostReason() != null ? db.getLostReason() : null)
                .totalAmount(db.getTotalAmount())
                .depositAmount(db.getDepositAmount())
                .remainingAmount(db.getRemainingAmount())
                .probability(db.getProbability())
                .description(db.getDescription())
                .nextFollowUpDate(db.getNextFollowUpDate())
                .expectedCloseDate(db.getExpectedCloseDate())
                .actualCloseDate(db.getActualCloseDate())
                .createdAt(db.getCreatedAt())
                .updatedAt(db.getUpdatedAt())
                .build();
    }
}