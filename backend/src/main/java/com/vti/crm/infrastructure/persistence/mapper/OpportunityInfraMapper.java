package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.Opportunity;
import com.vti.crm.infrastructure.persistence.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OpportunityInfraMapper {

    default OpportunityDbEntity toDbEntity(Opportunity domain) {
        if (domain == null) return null;
        OpportunityDbEntity e = new OpportunityDbEntity();
        e.setId(domain.getId());
        e.setOpportunityCode(domain.getOpportunityCode());
        e.setName(domain.getName());
        e.setCustomerId(domain.getCustomerId());
        e.setCampaignId(domain.getCampaignId());
        e.setStage(domain.getStage());
        e.setStatus(domain.getStatus());
        e.setLostReason(domain.getLostReason());
        e.setNextFollowUpDate(domain.getNextFollowUpDate());
        e.setTotalAmount(domain.getTotalAmount());
        e.setDepositAmount(domain.getDepositAmount());
        e.setRemainingAmount(domain.getRemainingAmount());
        e.setCurrencyCode(domain.getCurrencyCode());
        e.setProbability(domain.getProbability());
        e.setExpectedCloseDate(domain.getExpectedCloseDate());
        e.setActualCloseDate(domain.getActualCloseDate());
        e.setDescription(domain.getDescription());
        e.setAssignedTo(domain.getAssignedTo());
        e.setCreatedBy(domain.getCreatedBy());
        e.setUpdatedBy(domain.getUpdatedBy());
        e.setDeletedAt(domain.getDeletedAt());
        e.setCreatedAt(domain.getCreatedAt());
        e.setUpdatedAt(domain.getUpdatedAt());
        return e;
    }

    default Opportunity toDomain(OpportunityDbEntity db) {
        if (db == null) return null;
        return new Opportunity.OpportunityBuilder()
                .id(db.getId())
                .opportunityCode(db.getOpportunityCode())
                .name(db.getName())
                .customerId(db.getCustomerId())
                .campaignId(db.getCampaignId())
                .stage(db.getStage())
                .status(db.getStatus())
                .lostReason(db.getLostReason())
                .nextFollowUpDate(db.getNextFollowUpDate())
                .totalAmount(db.getTotalAmount())
                .depositAmount(db.getDepositAmount())
                .remainingAmount(db.getRemainingAmount())
                .currencyCode(db.getCurrencyCode())
                .probability(db.getProbability())
                .expectedCloseDate(db.getExpectedCloseDate())
                .actualCloseDate(db.getActualCloseDate())
                .description(db.getDescription())
                .assignedTo(db.getAssignedTo())
                .createdBy(db.getCreatedBy())
                .updatedBy(db.getUpdatedBy())
                .deletedAt(db.getDeletedAt())
                .createdAt(db.getCreatedAt())
                .updatedAt(db.getUpdatedAt())
                .build();
    }
}