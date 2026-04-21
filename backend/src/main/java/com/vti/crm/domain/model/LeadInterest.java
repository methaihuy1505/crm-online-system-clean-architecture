package com.vti.crm.domain.model;

import lombok.Getter;

@Getter
public class LeadInterest {
    private Integer id;
    private Integer leadId;
    private Integer productId;

    // Constructor phục dựng từ DB
    public LeadInterest(Integer id, Integer leadId, Integer productId) {
        this.id = id;
        this.leadId = leadId;
        this.productId = productId;
    }

    // Hành vi khởi tạo mới
    public static LeadInterest create(Integer leadId, Integer productId) {
        return new LeadInterest(null, leadId, productId);
    }
}