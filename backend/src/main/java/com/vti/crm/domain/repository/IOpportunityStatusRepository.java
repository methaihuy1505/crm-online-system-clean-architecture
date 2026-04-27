package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.OpportunityStatus;
import java.util.List;
import java.util.Optional;

public interface IOpportunityStatusRepository {
    OpportunityStatus save(OpportunityStatus status);
    Optional<OpportunityStatus> findById(Integer id);
    List<OpportunityStatus> findAll();
    boolean existsByCode(String code);
    void delete(OpportunityStatus status);
}