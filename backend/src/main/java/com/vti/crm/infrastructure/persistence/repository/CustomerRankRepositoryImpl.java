package com.vti.crm.infrastructure.persistence.repository;

import com.vti.crm.domain.model.CustomerRank;
import com.vti.crm.domain.repository.ICustomerRankRepository;
import com.vti.crm.infrastructure.persistence.mapper.CustomerRankInfraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class CustomerRankRepositoryImpl implements ICustomerRankRepository {
    private final JpaCustomerRankRepository jpaRepository;
    private final CustomerRankInfraMapper mapper;

    @Override
    public List<CustomerRank> findAll() {
        return jpaRepository.findAll().stream()
                .map(mapper::toDomain)
                .toList();
    }
}