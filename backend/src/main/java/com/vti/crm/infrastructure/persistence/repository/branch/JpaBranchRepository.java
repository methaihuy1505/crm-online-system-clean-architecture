package com.vti.crm.infrastructure.persistence.repository.branch;

import com.vti.crm.infrastructure.persistence.entity.BranchDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaBranchRepository extends JpaRepository<BranchDbEntity, Integer> {}