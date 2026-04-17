package com.vti.crm.infrastructure.persistence.repository;

import com.vti.crm.infrastructure.persistence.entity.CustomerDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaCustomerRepository extends JpaRepository<CustomerDbEntity, Long> {
}
