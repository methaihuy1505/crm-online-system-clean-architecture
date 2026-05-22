package com.vti.crm.application.usecases.campaign;

import com.vti.crm.domain.model.Campaign;
import com.vti.crm.domain.repository.ICampaignRepository;
import com.vti.crm.interfaces.dto.request.campaign.CampaignRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UpdateCampaignUseCase {
    private final ICampaignRepository campaignRepository;

    @Transactional
    public Campaign execute(Integer id, CampaignRequest request) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chiến dịch với ID: " + id));

        // Gọi hành vi nghiệp vụ từ Rich Model
        campaign.updateInfo(
                request.getName(),
                request.getDescription(),
                request.getStartDate(),
                request.getEndDate()
        );

        return campaignRepository.save(campaign);
    }
}