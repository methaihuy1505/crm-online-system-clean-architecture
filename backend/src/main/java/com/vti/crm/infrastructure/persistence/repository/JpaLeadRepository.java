package com.vti.crm.repository;

import com.vti.crm.entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Integer> {
    List<Lead> findByCampaignId(Integer campaignId);
}