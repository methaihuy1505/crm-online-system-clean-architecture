package com.vti.crm.repository;

import com.vti.crm.entity.LeadStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadStatusRepository extends JpaRepository<LeadStatus, Integer> {
    List<LeadStatus> findByIsActiveTrue();
}
