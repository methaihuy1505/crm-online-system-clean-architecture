package com.vti.crm.application.usecases.campaign;

import com.vti.crm.domain.model.Campaign;
import com.vti.crm.domain.repository.ICampaignRepository;
import com.vti.crm.interfaces.dto.request.CampaignRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CreateCampaignUseCase {

    private final ICampaignRepository campaignRepository;

    @Transactional
    public Campaign execute(CampaignRequest request) {
        Campaign newCampaign = Campaign.create(
                request.getName(),
                request.getDescription(),
                request.getStartDate(),
                request.getEndDate()
        );

        return campaignRepository.save(newCampaign);
    }
}