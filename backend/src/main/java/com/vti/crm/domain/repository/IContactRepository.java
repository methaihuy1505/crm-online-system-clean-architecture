package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.Contact;
import java.util.List;
import java.util.Optional;

public interface IContactRepository {
    Contact save(Contact contact);
    Optional<Contact> findById(Integer id);
    List<Contact> findByCustomerId(Integer customerId);
    List<Contact> findPrimaryContactsByCustomerId(Integer customerId);
    List<Contact> findAll();
}