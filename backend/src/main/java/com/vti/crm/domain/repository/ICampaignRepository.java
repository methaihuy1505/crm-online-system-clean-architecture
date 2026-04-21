package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.Campaign;
import java.util.List;
import java.util.Optional;

public interface ICampaignRepository {
    List<Campaign> findAll();
    Optional<Campaign> findById(Integer id);
    Campaign save(Campaign campaign);
    void delete(Integer id);
}