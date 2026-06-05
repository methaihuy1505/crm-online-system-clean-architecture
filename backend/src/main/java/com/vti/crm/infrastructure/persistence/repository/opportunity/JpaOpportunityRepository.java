package com.vti.crm.infrastructure.persistence.repository.opportunity;

import com.vti.crm.infrastructure.persistence.entity.OpportunityDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface JpaOpportunityRepository extends JpaRepository<OpportunityDbEntity, Integer>,
        JpaSpecificationExecutor<OpportunityDbEntity> {

    Optional<OpportunityDbEntity> findByOpportunityCode(String opportunityCode);

    boolean existsByOpportunityCode(String opportunityCode);

    @Query("SELECT SUM(o.totalAmount) FROM OpportunityDbEntity o WHERE o.createdAt >= :start AND o.createdAt <= :end")
    Double sumTotalAmountByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT SUM(o.totalAmount) FROM OpportunityDbEntity o")
    Double sumAllTotalAmount();

    // SỬA: countByStatusIdIn → countByStatusIn vì status là Integer, không phải entity
    long countByStatusIn(List<Integer> statusIds);

    // SỬA: countByStatusId → countByStatus
    long countByStatus(Integer statusId);

    @Query("SELECT SUM(o.totalAmount), COUNT(o) FROM OpportunityDbEntity o WHERE o.createdAt >= :start AND o.createdAt <= :end")
    Object[] getSumAndCountByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT o.status, COUNT(o) FROM OpportunityDbEntity o " +
            "WHERE o.status IN :statusIds " +
            "GROUP BY o.status")
    List<Object[]> countClosedOpportunities();

    @Modifying
    @Query("UPDATE OpportunityDbEntity o SET o.totalAmount = :total, o.remainingAmount = :remaining WHERE o.id = :id")
    void updateFinancialsManual(@Param("id") Integer id, @Param("total") Double total, @Param("remaining") Double remaining);
}