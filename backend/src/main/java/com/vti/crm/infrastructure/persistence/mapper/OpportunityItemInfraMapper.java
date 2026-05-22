package com.vti.crm.infrastructure.persistence.mapper;

import com.vti.crm.domain.model.OpportunityItem;
import com.vti.crm.infrastructure.persistence.entity.OpportunityItemDbEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OpportunityItemInfraMapper {

    OpportunityItemDbEntity toDbEntity(OpportunityItem domain);

    default OpportunityItem toDomain(OpportunityItemDbEntity db) {
        if (db == null) return null;
        return new OpportunityItem.OpportunityItemBuilder()
                .id(db.getId())
                .opportunityId(db.getOpportunityId())
                .productId(db.getProductId())
                .productName(db.getProductName())
                .uomName(db.getUomName())
                .quantity(db.getQuantity())
                .unitPrice(db.getUnitPrice())
                .vatRate(db.getVatRate())
                .discountRate(db.getDiscountRate())
                .lineItemNumber(db.getLineItemNumber())
                .note(db.getNote())
                .createdAt(db.getCreatedAt())
                .build();
    }
}