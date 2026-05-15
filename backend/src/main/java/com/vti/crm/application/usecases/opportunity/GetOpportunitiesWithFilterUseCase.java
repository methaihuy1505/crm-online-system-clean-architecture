package com.vti.crm.application.usecases.opportunity;

import com.vti.crm.domain.model.Opportunity;
import com.vti.crm.domain.model.OpportunityFilter;
import com.vti.crm.domain.repository.IOpportunityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetOpportunitiesWithFilterUseCase {

    private final IOpportunityRepository repository;

    public List<Opportunity> execute(OpportunityFilter filter) {
        return repository.findAllWithFilter(filter);
    }
}