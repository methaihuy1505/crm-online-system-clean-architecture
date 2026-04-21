package com.vti.crm.application.usecases.customerrank;

import com.vti.crm.domain.model.CustomerRank;
import com.vti.crm.domain.repository.ICustomerRankRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetAllCustomerRanksUseCase {
    private final ICustomerRankRepository repository;

    public List<CustomerRank> execute() {
        return repository.findAll();
    }
}