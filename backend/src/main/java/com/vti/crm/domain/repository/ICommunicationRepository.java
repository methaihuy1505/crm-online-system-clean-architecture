package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.CommunicationDetail;

import java.util.Optional;

public interface ICommunicationRepository {
    void save(CommunicationDetail detail);
    Optional<CommunicationDetail> findPrimary(Integer parentId, String parentType, String commType);
}
