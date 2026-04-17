package com.vti.crm.infrastructure.persistence.repository;


import com.vti.crm.domain.model.Customer;
import com.vti.crm.domain.repository.ICustomerRepository;
import com.vti.crm.infrastructure.persistence.entity.CustomerDbEntity;
import com.vti.crm.infrastructure.persistence.mapper.CustomerInfraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class CustomerRepositoryImpl implements ICustomerRepository {

    private final JpaCustomerRepository jpaRepository;
    private final CustomerInfraMapper mapper;

    @Override
    public void save(Customer customer) {
        CustomerDbEntity dbEntity = mapper.toDbEntity(customer);
        jpaRepository.save(dbEntity);
    }

    @Override
    public Customer findById(Long id) {
        CustomerDbEntity dbEntity = jpaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng"));
        return mapper.toDomainEntity(dbEntity);
    }

    @Override
    public List<Customer> findAll() {
        return jpaRepository.findAll().stream()
                .map(mapper::toDomainEntity)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.deleteById(id);
    }
}
