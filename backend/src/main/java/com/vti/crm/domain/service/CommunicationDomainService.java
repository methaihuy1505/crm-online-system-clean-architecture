package com.vti.crm.domain.service;

import com.vti.crm.domain.model.CommunicationDetail;
import java.util.Optional;

public class CommunicationDomainService {

    /**
     * Logic dùng chung: Nếu giá trị mới khác giá trị cũ, hạ cấp cái cũ xuống phụ, tạo cái mới làm chính
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

                // Tạo số mới làm số chính (isPrimary = true)
                return Optional.of(CommunicationDetail.createNew(parentId, parentType, commType, newValue, primaryLabel, true));
            }
            return Optional.empty(); // Không có gì thay đổi
        } else {
            // Chưa có thì tạo mới làm chính
            return Optional.of(CommunicationDetail.createNew(parentId, parentType, commType, newValue, primaryLabel, true));
        }
    }
}