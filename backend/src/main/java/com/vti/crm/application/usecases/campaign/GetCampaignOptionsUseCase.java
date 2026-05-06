package com.vti.crm.application.usecases.campaign;

import com.vti.crm.domain.model.Campaign;
import com.vti.crm.domain.repository.ICampaignRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetCampaignOptionsUseCase {

    private final ICampaignRepository campaignRepository;

    public List<Campaign> execute(int limit) {
        // Đảm bảo limit hợp lý
        int safeLimit = (limit > 0 && limit <= 500) ? limit : 100;

        return campaignRepository.findOptions(safeLimit);
    }
}