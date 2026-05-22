package com.vti.crm.infrastructure.persistence.repository.customer.customer_rank;

import com.vti.crm.infrastructure.persistence.entity.CustomerRankDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaCustomerRankRepository extends JpaRepository<CustomerRankDbEntity, Integer> {
}
