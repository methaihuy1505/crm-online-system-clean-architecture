package com.vti.crm.infrastructure.persistence.repository.branchprovince;

import com.vti.crm.infrastructure.persistence.entity.BranchProvinceDbEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaBranchProvinceRepository extends JpaRepository<BranchProvinceDbEntity, Integer> {}