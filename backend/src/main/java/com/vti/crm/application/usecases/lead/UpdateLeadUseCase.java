package com.vti.crm.application.usecases.lead;

import com.vti.crm.domain.model.*;
import com.vti.crm.domain.repository.*;
import com.vti.crm.domain.service.CommunicationDomainService;
import com.vti.crm.interfaces.dto.request.lead.LeadUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UpdateLeadUseCase {
    private final ILeadRepository leadRepository;
    private final ICommunicationRepository commRepository;
    private final ILeadInterestRepository interestRepository;

    private final CommunicationDomainService commDomainService = new CommunicationDomainService();

    @Transactional
    public Lead execute(Integer id, LeadUpdateRequest request, Integer updatedBy) {
        Lead lead = leadRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));

        // 1. Cập nhật thông tin cơ bản (Đã truyền thêm updatedBy ở tham số cuối cùng)
        lead.updateInfo(
                request.getFullName(), request.getCompanyName(), request.getPhone(),
                request.getEmail(), request.getWebsite(), request.getAddress(),
                request.getTaxCode(), request.getCitizenId(), request.getExpectedRevenue(),
                request.getDescription(), request.getSourceId(), request.getCampaignId(),
                request.getStatusId(), request.getProvinceId(), request.getBranchId(),
                request.getAssignedTo(), updatedBy
        );

        // 2. Xử lý Interests
        interestRepository.deleteByLeadId(id);
        interestRepository.saveInterests(id, request.getProductInterestIds());

        // 3. Xử lý Communication phức tạp qua Domain Service
        handleCommUpdate(id, request.getPhone(), "PHONE", "Số chính", "Số phụ");
        handleCommUpdate(id, request.getEmail(), "EMAIL", "Email chính", "Email phụ");

        return leadRepository.save(lead);
    }

    private void handleCommUpdate(Integer id, String newValue, String type, String primaryLabel, String secondaryLabel) {
        if (newValue == null || newValue.isBlank()) return;

        var currentPrimary = commRepository.findPrimary(id, "LEAD", type);
        var result = commDomainService.processUpdate(currentPrimary, newValue, id, "LEAD", type, primaryLabel, secondaryLabel);

        result.ifPresent(newComm -> {
            currentPrimary.ifPresent(commRepository::save);
            commRepository.save(newComm);
        });
    }
}