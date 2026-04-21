package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.Customer;
import java.util.List;
import java.util.Optional;

public interface ICustomerRepository {
    Customer save(Customer customer);
    Optional<Customer> findById(Integer id);
    List<Customer> findAll();
    List<Customer> findByCampaignId(Integer campaignId);

}