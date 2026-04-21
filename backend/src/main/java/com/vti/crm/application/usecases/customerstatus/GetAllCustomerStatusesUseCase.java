package com.vti.crm.application.usecases.customerstatus;

import com.vti.crm.domain.model.CustomerStatus;
import com.vti.crm.domain.repository.ICustomerStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetAllCustomerStatusesUseCase {
    private final ICustomerStatusRepository repository;

    public List<CustomerStatus> execute() {
        return repository.findAll();
    }
}