package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.Lead;
import java.util.List;
import java.util.Optional;

public interface ILeadRepository {
    Lead save(Lead lead);
    Optional<Lead> findById(Integer id);
    List<Lead> findAll();
    List<Lead> findByCampaignId(Integer campaignId);
}
