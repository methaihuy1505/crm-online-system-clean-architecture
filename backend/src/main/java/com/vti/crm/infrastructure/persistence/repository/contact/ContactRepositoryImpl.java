package com.vti.crm.infrastructure.persistence.repository.contact;

import com.vti.crm.domain.model.Contact;
import com.vti.crm.domain.repository.IContactRepository;
import com.vti.crm.infrastructure.persistence.entity.ContactDbEntity;
import com.vti.crm.infrastructure.persistence.mapper.ContactInfraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ContactRepositoryImpl implements IContactRepository {

    private final JpaContactRepository jpaRepository;
    private final ContactInfraMapper mapper;

    @Override
    public Contact save(Contact contact) {
        ContactDbEntity entity = mapper.toEntity(contact);
        return mapper.toDomain(jpaRepository.save(entity));
    }

    @Override
    public Optional<Contact> findById(Integer id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Contact> findAll() {
        return jpaRepository.findAll().stream().map(mapper::toDomain).toList();
    }

    @Override
    public List<Contact> searchByKeyword(String keyword) {
        return jpaRepository.searchByKeyword(keyword).stream().map(mapper::toDomain).toList();
    }

    @Override
    public List<Contact> findByCustomerId(Integer customerId) {
        return jpaRepository.findByCustomerId(customerId).stream().map(mapper::toDomain).toList();
    }

    @Override
    public List<Contact> findPrimaryContactsByCustomerId(Integer customerId) {
        // Gọi hàm của JpaRepository cũ bạn đã định nghĩa
        return jpaRepository.findByCustomerIdAndIsPrimaryTrue(customerId).stream().map(mapper::toDomain).toList();
    }
}