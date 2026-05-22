package com.vti.crm.infrastructure.persistence.repository.contact;

import com.vti.crm.infrastructure.persistence.entity.ContactDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaContactRepository extends JpaRepository<ContactDbEntity, Integer> {

    // Tìm tất cả liên hệ của một công ty
    List<ContactDbEntity> findByCustomerId(Integer customerId);

    // Tìm những ai đang là liên hệ chính của công ty đó
    List<ContactDbEntity> findByCustomerIdAndIsPrimaryTrue(Integer customerId);
}