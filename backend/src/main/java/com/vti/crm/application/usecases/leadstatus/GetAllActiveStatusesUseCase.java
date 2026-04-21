package com.vti.crm.application.usecases.leadstatus;

import com.vti.crm.domain.model.LeadStatus;
import com.vti.crm.domain.repository.ILeadStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetAllActiveStatusesUseCase {
    private final ILeadStatusRepository repository;

    public List<LeadStatus> execute() {
        return repository.findActiveStatuses();
    }
}