package com.vti.crm.repository;

import com.vti.crm.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Integer> {

    // Tìm tất cả liên hệ của một công ty
    List<Contact> findByCustomerId(Integer customerId);

    // Tìm những ai đang là liên hệ chính của công ty đó
    List<Contact> findByCustomerIdAndIsPrimaryTrue(Integer customerId);
}