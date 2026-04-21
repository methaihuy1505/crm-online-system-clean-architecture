package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.CustomerRank;
import java.util.List;

public interface ICustomerRankRepository {
    List<CustomerRank> findAll();
}