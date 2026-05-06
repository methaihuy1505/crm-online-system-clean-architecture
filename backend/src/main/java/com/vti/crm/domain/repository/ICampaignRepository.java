package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.Campaign;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ICampaignRepository {
    Page<Campaign> searchCampaigns(String keyword, List<String> statuses, LocalDate fromDate, LocalDate toDate, Pageable pageable);
    Optional<Campaign> findById(Integer id);
    Campaign save(Campaign campaign);
    void delete(Integer id);
    List<Campaign> findOptions(int limit);
}