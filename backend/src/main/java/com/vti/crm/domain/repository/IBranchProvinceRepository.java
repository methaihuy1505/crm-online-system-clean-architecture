package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.BranchProvince;
import java.util.List;
import java.util.Optional;

public interface IBranchProvinceRepository {
    List<BranchProvince> findAll();
    Optional<BranchProvince> findById(Integer id);
    BranchProvince save(BranchProvince branchProvince);
    void deleteById(Integer id);
}