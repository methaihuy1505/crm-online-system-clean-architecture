package com.vti.crm.infrastructure.persistence.repository;

import com.vti.crm.infrastructure.persistence.entity.CustomerDbEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaCustomerRepository extends JpaRepository<CustomerDbEntity, Integer> {

    // NÂNG CẤP: Dùng List<Integer> và toán tử IN để lọc nhiều giá trị
    @Query("SELECT c FROM CustomerDbEntity c WHERE " +
            "(:keyword IS NULL OR c.name LIKE CONCAT('%', :keyword, '%') OR c.customerCode LIKE CONCAT('%', :keyword, '%') OR c.mainPhone LIKE CONCAT('%', :keyword, '%') OR c.taxCode LIKE CONCAT('%', :keyword, '%')) AND " +
            "(:statusIds IS NULL OR c.status.id IN :statusIds) AND " +
            "(:rankIds IS NULL OR c.rank.id IN :rankIds) AND " +
            "(:isOrganization IS NULL OR c.isOrganization = :isOrganization) AND " +
            "(:sourceIds IS NULL OR c.sourceId IN :sourceIds) AND " +
            "(:campaignIds IS NULL OR c.campaignId IN :campaignIds)")
    Page<CustomerDbEntity> searchCustomers(
            @Param("keyword") String keyword,
            @Param("statusIds") List<Integer> statusIds,
            @Param("rankIds") List<Integer> rankIds,
            @Param("isOrganization") Boolean isOrganization,
            @Param("sourceIds") List<Integer> sourceIds,
            @Param("campaignIds") List<Integer> campaignIds,
            Pageable pageable
    );

    List<CustomerDbEntity> findByCampaignId(Integer campaignId);
}