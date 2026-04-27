package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.LostReason;
import java.util.List;
import java.util.Optional;

public interface ILostReasonRepository {
    LostReason save(LostReason lostReason);
    Optional<LostReason> findById(Integer id);
    List<LostReason> findAll();
    boolean existsByCode(String code);
    void delete(LostReason lostReason);
}