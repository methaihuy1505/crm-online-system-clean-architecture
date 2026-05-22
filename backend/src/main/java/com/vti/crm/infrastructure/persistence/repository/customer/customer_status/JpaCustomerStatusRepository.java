package com.vti.crm.infrastructure.persistence.repository.customer.customer_status;

import com.vti.crm.infrastructure.persistence.entity.CustomerStatusDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaCustomerStatusRepository extends JpaRepository<CustomerStatusDbEntity, Integer> {
}
