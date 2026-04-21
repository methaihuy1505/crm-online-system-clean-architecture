package com.vti.crm.infrastructure.persistence.repository;

import com.vti.crm.infrastructure.persistence.entity.LeadStatusDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaLeadStatusRepository extends JpaRepository<LeadStatusDbEntity, Integer> {
    List<LeadStatusDbEntity> findByIsActiveTrue();
}
