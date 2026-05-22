package com.vti.crm.application.usecases.campaign;

import com.vti.crm.infrastructure.persistence.repository.campaign.JpaCampaignRepository;
import com.vti.crm.infrastructure.persistence.repository.lead.JpaLeadRepository;
import com.vti.crm.interfaces.dto.response.campaign.CampaignStatsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CampaignStatsUseCase {
    private final JpaCampaignRepository campaignRepo;
    private final JpaLeadRepository leadRepo;

    public CampaignStatsResponse execute() {
        CampaignStatsResponse stats = new CampaignStatsResponse();
        stats.setTotalCampaigns(campaignRepo.count());
        stats.setOngoingCampaigns(campaignRepo.countOngoingCampaigns());
        stats.setTotalLeads(leadRepo.countLeadsFromCampaigns());
        stats.setExpectedRevenue(leadRepo.calculateExpectedRevenueFromCampaigns());
        stats.setActualRevenue(leadRepo.calculateActualRevenueFromCampaigns());
        return stats;
    }
}