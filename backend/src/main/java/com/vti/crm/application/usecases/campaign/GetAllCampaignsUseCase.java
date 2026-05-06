package com.vti.crm.application.usecases.campaign;

import com.vti.crm.domain.model.Campaign;
import com.vti.crm.domain.repository.ICampaignRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GetAllCampaignsUseCase {
    private final ICampaignRepository campaignRepository;

    public Page<Campaign> execute(String keyword, List<String> statuses, LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        List<String> safeStatuses = (statuses != null && statuses.isEmpty()) ? null : statuses;
        return campaignRepository.searchCampaigns(keyword, safeStatuses, fromDate, toDate, pageable);
    }
}