package com.vti.crm.domain.repository;

import java.util.List;

public interface ILeadInterestRepository {
    // Nhận đúng ID và List Integer, mộc mạc và sạch sẽ!
    void saveInterests(Integer leadId, List<Integer> productIds);
    void deleteByLeadId(Integer leadId);
    List<Integer> findProductIdsByLeadId(Integer leadId);
}