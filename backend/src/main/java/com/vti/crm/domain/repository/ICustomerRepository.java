package com.vti.crm.domain.repository;


import com.vti.crm.domain.model.Customer;

import java.util.List;

public interface ICustomerRepository {
    void save(Customer customer);
    Customer findById(Long id);
    List<Customer> findAll();
    void deleteById(Long id);
}
