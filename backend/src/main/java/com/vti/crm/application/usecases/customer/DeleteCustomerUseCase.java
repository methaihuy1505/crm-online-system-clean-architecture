package com.vti.crm.application.usecases.customer;


import com.vti.crm.domain.repository.ICustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteCustomerUseCase {
    private final ICustomerRepository repository;

    public void execute(Long id) {
        repository.deleteById(id);
    }
}