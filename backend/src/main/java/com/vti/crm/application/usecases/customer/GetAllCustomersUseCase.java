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

    // 🌟 THÊM currentUserId, roleId VÀO THAM SỐ
    public Page<Customer> execute(String keyword, List<Integer> statusIds, List<Integer> rankIds, Boolean isOrganization, List<Integer> sourceIds, List<Integer> campaignIds, Pageable pageable, Integer currentUserId, Integer roleId) {

        // 🌟 LOGIC PHÂN QUYỀN: Admin(1) hoặc Manager(4) thì lấy null (Tất cả), Sale thì lấy ID của chính họ
        Integer filterUserId = (roleId != null && (roleId == 1 || roleId == 4)) ? null : currentUserId;

        List<Integer> safeStatusIds = (statusIds != null && statusIds.isEmpty()) ? null : statusIds;
        List<Integer> safeRankIds = (rankIds != null && rankIds.isEmpty()) ? null : rankIds;
        List<Integer> safeSourceIds = (sourceIds != null && sourceIds.isEmpty()) ? null : sourceIds;
        List<Integer> safeCampaignIds = (campaignIds != null && campaignIds.isEmpty()) ? null : campaignIds;

        // 🌟 TRUYỀN THÊM filterUserId
        return customerRepository.findCustomers(keyword, safeStatusIds, safeRankIds, isOrganization, safeSourceIds, safeCampaignIds, pageable, filterUserId);
    }
}