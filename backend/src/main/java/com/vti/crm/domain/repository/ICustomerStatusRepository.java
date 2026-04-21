package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.CustomerStatus;
import java.util.List;

public interface ICustomerStatusRepository {
    List<CustomerStatus> findAll();
}