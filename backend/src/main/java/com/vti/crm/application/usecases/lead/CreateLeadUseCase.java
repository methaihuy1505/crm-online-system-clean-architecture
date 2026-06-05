package com.vti.crm.application.usecases.lead;

import com.vti.crm.domain.model.Lead;
import com.vti.crm.domain.model.CommunicationDetail;
import com.vti.crm.domain.repository.*;
import com.vti.crm.interfaces.dto.request.lead.LeadCreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CreateLeadUseCase {
    private final ILeadRepository leadRepository;
    private final ICommunicationRepository commRepository;
    private final ILeadInterestRepository interestRepository;

    @Transactional
    public Lead execute(LeadCreateRequest request, Integer currentUserId) { // THÊM currentUserId

        // 1. Validate logic
        if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
            throw new IllegalArgumentException("Họ và tên Lead không được để trống!");
        }

        // 2. Dùng Constructor tạo mới (Sạch sẽ và ngắn gọn hơn rất nhiều)
        Lead lead = new Lead(
                request.getFullName(), request.getCompanyName(), request.getPhone(),
                request.getEmail(), request.getWebsite(), request.getTaxCode(),
                request.getCitizenId(), request.getAddress(), request.getProvinceId(),
                request.getBranchId(), request.getSourceId(), request.getCampaignId(),
                request.getStatusId(), request.getExpectedRevenue(), request.getDescription(),
                request.getAssignedTo(),
                currentUserId
        );

        Lead savedLead = leadRepository.save(lead);

        // 3. Lưu Interests
        interestRepository.saveInterests(savedLead.getId(), request.getProductInterestIds());

        // 4. Lưu Communications
        saveDefaultComm(savedLead.getId(), request.getPhone(), "PHONE", "Số chính");
        saveDefaultComm(savedLead.getId(), request.getEmail(), "EMAIL", "Email chính");

        return savedLead;
    }

    private void saveDefaultComm(Integer id, String value, String type, String label) {
        if (value != null && !value.isBlank()) {
            commRepository.save(CommunicationDetail.createNew(id, "LEAD", type, value, label, true));
        }
    }
}