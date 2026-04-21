package com.vti.crm.repository;

import com.vti.crm.entity.CustomerRank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRankRepository extends JpaRepository<CustomerRank, Integer> {
}
