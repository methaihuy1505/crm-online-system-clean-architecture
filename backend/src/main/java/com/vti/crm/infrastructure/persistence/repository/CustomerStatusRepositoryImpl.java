package com.vti.crm.infrastructure.persistence.repository;

import com.vti.crm.domain.model.CustomerStatus;
import com.vti.crm.domain.repository.ICustomerStatusRepository;
import com.vti.crm.infrastructure.persistence.mapper.CustomerStatusInfraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class CustomerStatusRepositoryImpl implements ICustomerStatusRepository {
    private final JpaCustomerStatusRepository jpaRepository;
    private final CustomerStatusInfraMapper mapper;

    @Override
    public List<CustomerStatus> findAll() {
        return jpaRepository.findAll().stream()
                .map(mapper::toDomain)
                .toList();
    }
}