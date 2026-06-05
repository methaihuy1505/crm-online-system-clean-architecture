package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ICustomerRepository {
    Page<Customer> findCustomers(
            String keyword,
            List<Integer> statusIds,
            List<Integer> rankIds,
            Boolean isOrganization,
            List<Integer> sourceIds,
            List<Integer> campaignIds,
            Pageable pageable,
            Integer filterUserId // 🌟 THÊM DÒNG NÀY
    );

    Customer save(Customer customer);
    Optional<Customer> findById(Integer id);

    Optional<Customer> findByIdWithFilter(Integer id, Integer filterUserId);

    List<Customer> findAll();
    List<Customer> findByCampaignId(Integer campaignId);
}