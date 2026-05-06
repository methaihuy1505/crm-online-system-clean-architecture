package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.Lead;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ILeadRepository {
    Lead save(Lead lead);
    Optional<Lead> findById(Integer id);
    List<Lead> findByCampaignId(Integer campaignId);

    Page<Lead> searchLeads(String keyword, List<Integer> statusIds, List<Integer> sourceIds, List<Integer> campaignIds,
                           Integer provinceId, Integer branchId, Pageable pageable);
}