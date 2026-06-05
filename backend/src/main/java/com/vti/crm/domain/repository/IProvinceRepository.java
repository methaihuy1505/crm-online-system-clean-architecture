package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.Province;
import java.util.List;
import java.util.Optional;

public interface IProvinceRepository {
    List<Province> findAll();
    Optional<Province> findById(Integer id);
    Province save(Province province);
    void deleteById(Integer id);
}