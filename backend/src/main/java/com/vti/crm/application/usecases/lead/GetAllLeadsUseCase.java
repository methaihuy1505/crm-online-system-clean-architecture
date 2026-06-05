package com.vti.crm.application.usecases.lead;

import com.vti.crm.domain.model.Lead;
import com.vti.crm.domain.repository.ILeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetAllLeadsUseCase {
    private final ILeadRepository leadRepository;

    public Page<Lead> execute(String keyword, List<Integer> statusIds, List<Integer> sourceIds, List<Integer> campaignIds,
                              Integer provinceId, Integer branchId, Pageable pageable,
                              Integer currentUserId, Integer roleId) {

        List<Integer> safeStatusIds = (statusIds != null && statusIds.isEmpty()) ? null : statusIds;
        List<Integer> safeSourceIds = (sourceIds != null && sourceIds.isEmpty()) ? null : sourceIds;
        List<Integer> safeCampaignIds = (campaignIds != null && campaignIds.isEmpty()) ? null : campaignIds;

        Integer assignedToFilter = null;

        if (roleId != null && roleId != 1 && roleId != 4) {
            assignedToFilter = currentUserId;
        }

        return leadRepository.searchLeads(keyword, safeStatusIds, safeSourceIds, safeCampaignIds, provinceId, branchId, assignedToFilter, pageable);
    }
}