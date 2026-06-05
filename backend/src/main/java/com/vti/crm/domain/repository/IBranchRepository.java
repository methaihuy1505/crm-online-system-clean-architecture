package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.Branch;
import java.util.List;
import java.util.Optional;

public interface IBranchRepository {
    List<Branch> findAll();
    Optional<Branch> findById(Integer id);
    Branch save(Branch branch);
    void deleteById(Integer id);
    List<Branch> findAllById(List<Integer> ids);
}