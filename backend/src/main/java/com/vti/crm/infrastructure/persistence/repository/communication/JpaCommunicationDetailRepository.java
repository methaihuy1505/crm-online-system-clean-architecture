package com.vti.crm.infrastructure.persistence.repository.communication;

import com.vti.crm.infrastructure.persistence.entity.CommunicationDetailDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JpaCommunicationDetailRepository extends JpaRepository<CommunicationDetailDbEntity, Integer> {

    // Tìm danh sách liên lạc dựa theo Loại đối tượng (Lead/Customer) và ID
    List<CommunicationDetailDbEntity> findByParentTypeAndParentId(CommunicationDetailDbEntity.ParentType parentType, Integer parentId);

    // Tìm liên lạc đang là "Chính" (Primary) của một đối tượng theo loại (Phone/Email) để phục vụ Update
    Optional<CommunicationDetailDbEntity> findByParentIdAndParentTypeAndCommTypeAndIsPrimaryTrue(
            Integer parentId,
            CommunicationDetailDbEntity.ParentType parentType,
            CommunicationDetailDbEntity.CommType commType
    );
}