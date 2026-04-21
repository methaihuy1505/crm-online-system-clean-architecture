package com.vti.crm.repository;

import com.vti.crm.entity.CommunicationDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunicationDetailRepository extends JpaRepository<CommunicationDetail, Integer> {

    // Tìm danh sách liên lạc dựa theo Loại đối tượng (Lead/Customer) và ID
    List<CommunicationDetail> findByParentTypeAndParentId(CommunicationDetail.ParentType parentType, Integer parentId);

    // Tìm liên lạc đang là "Chính" (Primary) của một đối tượng theo loại (Phone/Email) để phục vụ Update
    Optional<CommunicationDetail> findByParentIdAndParentTypeAndCommTypeAndIsPrimaryTrue(
            Integer parentId,
            CommunicationDetail.ParentType parentType,
            CommunicationDetail.CommType commType
    );
}