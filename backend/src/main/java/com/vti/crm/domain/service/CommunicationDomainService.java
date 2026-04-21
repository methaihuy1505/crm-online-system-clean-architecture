package com.vti.crm.domain.service;

import com.vti.crm.domain.model.CommunicationDetail;
import java.util.Optional;

public class LeadCommunicationDomainService {

    /**
     * Logic: Nếu giá trị mới khác giá trị cũ, hạ cấp cái cũ xuống phụ, tạo cái mới làm chính
     */
    public Optional<CommunicationDetail> processUpdate(
            Optional<CommunicationDetail> currentPrimaryOpt,
            String newValue,
            Integer parentId,
            String parentType,
            String commType,
            String primaryLabel,
            String secondaryLabel) {

        if (currentPrimaryOpt.isPresent()) {
            CommunicationDetail currentPrimary = currentPrimaryOpt.get();
            if (!currentPrimary.getCommValue().equals(newValue)) {
                // Đổi số cũ thành số phụ
                currentPrimary.demoteToSecondary(secondaryLabel);

                // Đã fix: Dùng createNew và thêm true (isPrimary = true) ở cuối
                return Optional.of(CommunicationDetail.createNew(parentId, parentType, commType, newValue, primaryLabel, true));
            }
            return Optional.empty(); // Không có gì thay đổi
        } else {
            // Đã fix: Dùng createNew và thêm true (isPrimary = true) ở cuối
            return Optional.of(CommunicationDetail.createNew(parentId, parentType, commType, newValue, primaryLabel, true));
        }
    }
}