package com.vti.crm.infrastructure.persistence.repository.campaign;

import com.vti.crm.infrastructure.persistence.entity.CampaignDbEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface JpaCampaignRepository extends JpaRepository<CampaignDbEntity, Integer> {

    @Query("SELECT COUNT(c) FROM CampaignDbEntity c WHERE c.startDate <= CURRENT_DATE AND c.endDate >= CURRENT_DATE")
    long countOngoingCampaigns();

    // NÂNG CẤP: Xử lý mảng trạng thái ảo (Calculated Status)
    @Query("SELECT c FROM CampaignDbEntity c WHERE " +
            "(:keyword IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
            "(:fromDate IS NULL OR c.startDate >= :fromDate) AND " +
            "(:toDate IS NULL OR c.endDate <= :toDate) AND " +
            "(:statuses IS NULL OR " +
            "  ('Sắp tới' IN :statuses AND c.startDate > CURRENT_DATE) OR " +
            "  ('Đang diễn ra' IN :statuses AND c.startDate <= CURRENT_DATE AND c.endDate >= CURRENT_DATE) OR " +
            "  ('Đã kết thúc' IN :statuses AND c.endDate < CURRENT_DATE))")
    Page<CampaignDbEntity> searchCampaigns(
            @Param("keyword") String keyword,
            @Param("statuses") List<String> statuses,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate,
            Pageable pageable
    );

    List<CampaignDbEntity> findAllByOrderByStartDateDesc(Pageable pageable);
}