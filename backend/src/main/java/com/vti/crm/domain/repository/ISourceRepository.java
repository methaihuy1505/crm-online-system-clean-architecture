package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.Source;

import java.util.List;

public interface ISourceRepository {
     List<Source> findActiveSources();
}
