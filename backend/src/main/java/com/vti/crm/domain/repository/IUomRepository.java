package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.Uom;
import java.util.List;
import java.util.Optional;

public interface IUomRepository {
    Uom save(Uom uom);
    void delete(Uom uom);
    Optional<Uom> findById(Integer id);
    Optional<Uom> findByCode(String code);
    boolean existsByCode(String code);
    List<Uom> findAll();
}