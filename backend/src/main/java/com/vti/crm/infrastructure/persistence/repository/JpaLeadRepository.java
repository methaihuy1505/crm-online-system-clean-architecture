package com.vti.crm.infrastructure.persistence.repository;

import com.vti.crm.infrastructure.persistence.entity.LeadDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaLeadRepository extends JpaRepository<LeadDbEntity, Integer> {
    List<LeadDbEntity> findByCampaignId(Integer campaignId);
}