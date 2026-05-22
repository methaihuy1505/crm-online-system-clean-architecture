package com.vti.crm.infrastructure.persistence.repository.customer;

import com.vti.crm.domain.model.Customer;
import com.vti.crm.domain.repository.ICustomerRepository;
import com.vti.crm.infrastructure.persistence.entity.CustomerDbEntity;
import com.vti.crm.infrastructure.persistence.mapper.CustomerInfraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CustomerRepositoryImpl implements ICustomerRepository {

    private final JpaCustomerRepository jpaRepository;
    private final CustomerInfraMapper mapper;

    @Override
    public Customer save(Customer customer) {
        CustomerDbEntity entity = mapper.toEntity(customer);
        return mapper.toDomain(jpaRepository.save(entity));
    }

    @Override
    public Optional<Customer> findById(Integer id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Customer> findAll() {
        return jpaRepository.findAll().stream().map(mapper::toDomain).toList();
    }

    // Cập nhật tham số List<Integer>
    @Override
    public Page<Customer> findCustomers(String keyword, List<Integer> statusIds, List<Integer> rankIds, Boolean isOrganization, List<Integer> sourceIds, List<Integer> campaignIds, Pageable pageable) {
        Page<CustomerDbEntity> entityPage = jpaRepository.searchCustomers(
                keyword, statusIds, rankIds, isOrganization, sourceIds, campaignIds, pageable
        );
        return entityPage.map(mapper::toDomain);
    }

    @Override
    public List<Customer> findByCampaignId(Integer campaignId) {
        return jpaRepository.findByCampaignId(campaignId).stream().map(mapper::toDomain).toList();
    }
}