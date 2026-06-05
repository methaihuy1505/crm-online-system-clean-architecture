package com.vti.crm.infrastructure.persistence.repository.lead.lead_interest;

import com.vti.crm.infrastructure.persistence.entity.LeadInterestDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param; // Thêm import này
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List; // Thêm import này

@Repository
public interface JpaLeadInterestRepository extends JpaRepository<LeadInterestDbEntity, Integer> {
    @Modifying
    @Transactional
    @Query("DELETE FROM LeadInterestDbEntity li WHERE li.lead.id = :leadId")
    void deleteByLeadId(Integer leadId);

    @Query("SELECT li.productId FROM LeadInterestDbEntity li WHERE li.lead.id = :leadId")
    List<Integer> findProductIdsByLeadId(@Param("leadId") Integer leadId);
}