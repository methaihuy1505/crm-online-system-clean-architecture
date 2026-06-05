package com.vti.crm.domain.service;

import com.vti.crm.domain.model.Customer;
import com.vti.crm.domain.model.Lead;

public class LeadConversionDomainService {

    public Customer convertToCustomer(Lead lead, Integer convertedStatusId, Integer currentUserId) {
        if (lead.getStatusId().equals(convertedStatusId)) {
            throw new IllegalStateException("Khách hàng tiềm năng này đã được chuyển đổi trước đó!");
        }

        lead.changeStatus(convertedStatusId, currentUserId);

        // PHÂN BIỆT B2B VÀ B2C ĐỂ LẤY TÊN CHO ĐÚNG
        boolean isB2B = lead.getCompanyName() != null && !lead.getCompanyName().isBlank();
        String customerName = isB2B ? lead.getCompanyName() : lead.getFullName();

        return Customer.create(
                customerName,
                null,
                isB2B,
                lead.getTaxCode(),
                lead.getCitizenId(),
                null,
                lead.getPhone(),
                lead.getEmail(),
                null,
                lead.getWebsite(),
                lead.getAddress(),
                lead.getAddress(),
                lead.getDescription(),
                lead.getSourceId(),
                lead.getCampaignId(),
                1,
                null,
                lead.getBranchId(),
                lead.getProvinceId(),
                lead.getAssignedTo(),
                currentUserId
        );
    }
}