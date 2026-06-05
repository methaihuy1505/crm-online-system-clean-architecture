package com.vti.crm.infrastructure.persistence.repository.lead;

import com.vti.crm.infrastructure.persistence.entity.LeadDbEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface JpaLeadRepository extends JpaRepository<LeadDbEntity, Integer> {
    List<LeadDbEntity> findByCampaignId(Integer campaignId);

    @Query("SELECT l FROM LeadDbEntity l WHERE " +
            "(:keyword IS NULL OR LOWER(l.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(l.phone) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(l.email) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:statusIds IS NULL OR l.status.id IN :statusIds) AND " +
            "(:sourceIds IS NULL OR l.source.id IN :sourceIds) AND " +
            "(:campaignIds IS NULL OR l.campaign.id IN :campaignIds) AND " +
            "(:provinceId IS NULL OR l.province.id = :provinceId) AND " +
            "(:branchId IS NULL OR l.branch.id = :branchId) AND " +
            "(:assignedTo IS NULL OR l.assignedToUser.id = :assignedTo) " +
            "ORDER BY l.id DESC")
    Page<LeadDbEntity> searchLeads(
            @Param("keyword") String keyword,
            @Param("statusIds") List<Integer> statusIds,
            @Param("sourceIds") List<Integer> sourceIds,
            @Param("campaignIds") List<Integer> campaignIds,
            @Param("provinceId") Integer provinceId,
            @Param("branchId") Integer branchId,
            @Param("assignedTo") Integer assignedTo,
            Pageable pageable
    );

    @Query("SELECT COUNT(l) FROM LeadDbEntity l WHERE l.campaign IS NOT NULL")
    long countLeadsFromCampaigns();

    @Query("SELECT COALESCE(SUM(l.expectedRevenue), 0) FROM LeadDbEntity l WHERE l.campaign IS NOT NULL AND l.status.id IN (1, 2)")
    BigDecimal calculateExpectedRevenueFromCampaigns();

    @Query("SELECT COALESCE(SUM(l.expectedRevenue), 0) FROM LeadDbEntity l WHERE l.campaign IS NOT NULL AND l.status.id IN (3, 4)")
    BigDecimal calculateActualRevenueFromCampaigns();
}