package com.vti.crm.application.usecases.campaign;

import com.vti.crm.domain.model.Campaign;
import com.vti.crm.domain.repository.ICampaignRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GetAllCampaignsUseCase {
    private final ICampaignRepository campaignRepository;

    public List<Campaign> execute() {
        return campaignRepository.findAll();
    }
}