package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.Module;

import java.util.List;

public interface IModuleRepository {
    /** Trả về tất cả module active, sắp xếp theo sort_order tăng dần */
    List<Module> findAllActiveOrderBySortOrder();
}
