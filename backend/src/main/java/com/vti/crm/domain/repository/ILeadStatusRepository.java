package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.LeadStatus;
import java.util.List;

public interface ILeadStatusRepository {
    List<LeadStatus> findActiveStatuses();
}