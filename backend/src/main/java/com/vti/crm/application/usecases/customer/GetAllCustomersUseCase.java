package com.vti.crm.application.usecases.customer;

import com.vti.crm.domain.model.Customer;
import com.vti.crm.domain.repository.ICustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetAllCustomersUseCase {
    private final ICustomerRepository customerRepository;

    public Page<Customer> execute(String keyword, List<Integer> statusIds, List<Integer> rankIds, Boolean isOrganization, List<Integer> sourceIds, List<Integer> campaignIds, Pageable pageable) {
        // BẢO VỆ CÚ PHÁP SQL: Chuyển mảng rỗng [] thành null để không sập lệnh IN()
        List<Integer> safeStatusIds = (statusIds != null && statusIds.isEmpty()) ? null : statusIds;
        List<Integer> safeRankIds = (rankIds != null && rankIds.isEmpty()) ? null : rankIds;
        List<Integer> safeSourceIds = (sourceIds != null && sourceIds.isEmpty()) ? null : sourceIds;
        List<Integer> safeCampaignIds = (campaignIds != null && campaignIds.isEmpty()) ? null : campaignIds;

        return customerRepository.findCustomers(keyword, safeStatusIds, safeRankIds, isOrganization, safeSourceIds, safeCampaignIds, pageable);
    }
}