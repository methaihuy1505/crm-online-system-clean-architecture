package com.vti.crm.application.usecases.customer;


import com.vti.crm.domain.model.Customer;
import com.vti.crm.domain.repository.ICustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UpdateCustomerUseCase {
    private final ICustomerRepository repository;

    public void execute(Long id, String fullName, String email, String phone) {
        Customer customer = repository.findById(id);
        customer.update(fullName, email, phone);
        repository.save(customer);
    }
}
