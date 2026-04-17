package com.vti.crm.application.usecases.customer;


import com.vti.crm.domain.model.Customer;
import com.vti.crm.domain.repository.ICustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetCustomerUseCase {
    private final ICustomerRepository repository;

    public List<Customer> executeGetAll() {
        return repository.findAll();
    }

    public Customer executeGetById(Long id) {
        return repository.findById(id);
    }
}
