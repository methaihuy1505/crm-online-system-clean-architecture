package com.vti.crm.repository;

import com.vti.crm.entity.LeadInterest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
@Repository
public interface LeadInterestRepository extends JpaRepository<LeadInterest, Integer> {
    @Modifying
    @Transactional
    @Query("DELETE FROM LeadInterest li WHERE li.lead.id = :leadId")
    void deleteByLeadId(Integer leadId);
}
