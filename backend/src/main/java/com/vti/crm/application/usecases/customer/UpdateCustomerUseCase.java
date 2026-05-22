package com.vti.crm.application.usecases.customer;

import com.vti.crm.domain.model.Customer;
import com.vti.crm.domain.repository.IContactRepository;
import com.vti.crm.domain.repository.ICustomerRepository;
import com.vti.crm.domain.repository.ICommunicationRepository;
import com.vti.crm.domain.service.CommunicationDomainService;
import com.vti.crm.interfaces.dto.request.customer.CustomerUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UpdateCustomerUseCase {

    private final ICustomerRepository customerRepository;
    private final IContactRepository contactRepository;
    private final ICommunicationRepository commRepository;

    // Dùng chung Domain Service xử lý Số chính/phụ
    private final CommunicationDomainService commDomainService = new CommunicationDomainService();

    @Transactional
    public Customer execute(Integer id, CustomerUpdateRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Khách hàng với ID: " + id));

        // 1. Cập nhật thông tin qua hành vi của Entity
        customer.updateInfo(
                request.getName(), request.getShortName(), request.getIsOrganization(),
                request.getTaxCode(), request.getCitizenId(), request.getFoundedDate(),
                request.getMainPhone(), request.getEmailOfficial(), request.getFax(),
                request.getWebsite(), request.getAddressCompany(), request.getAddressBilling(),
                request.getDescription(), request.getSourceId(), request.getCampaignId(),
                request.getStatusId(), request.getRankId(), request.getBranchId(),
                request.getProvinceId(), request.getAssignedUserId()
        );
        Customer updatedCustomer = customerRepository.save(customer);

        // 2. Cập nhật lịch sử liên lạc của Khách hàng
        handleCommUpdate(id, "CUSTOMER", request.getMainPhone(), "PHONE", "Số chính", "Số phụ");
        handleCommUpdate(id, "CUSTOMER", request.getEmailOfficial(), "EMAIL", "Email chính", "Email phụ");
        handleCommUpdate(id, "CUSTOMER", request.getFax(), "FAX", "Fax", "Fax cũ");

        // 3. Logic B2C: Đồng bộ Update sang Contact tráng gương
        if (Boolean.FALSE.equals(updatedCustomer.getIsOrganization()) && updatedCustomer.getPrimaryContactId() != null) {
            contactRepository.findById(updatedCustomer.getPrimaryContactId()).ifPresent(contact -> {
                // Update Model
                contact.updateInfo(contact.getFirstName(), contact.getLastName(), contact.getJobTitle(), contact.getBirthday(), request.getEmailOfficial(), request.getMainPhone(), contact.getIsPrimary());
                contactRepository.save(contact);

                // Update lịch sử liên lạc của Contact
                handleCommUpdate(contact.getId(), "CONTACT", request.getMainPhone(), "PHONE", "Số chính", "Số phụ");
                handleCommUpdate(contact.getId(), "CONTACT", request.getEmailOfficial(), "EMAIL", "Email chính", "Email phụ");
            });
        }

        return updatedCustomer;
    }

    private void handleCommUpdate(Integer parentId, String parentType, String newValue, String type, String primaryLabel, String secondaryLabel) {
        if (newValue == null || newValue.isBlank()) return;

        var currentPrimary = commRepository.findPrimary(parentId, parentType, type);
        var result = commDomainService.processUpdate(currentPrimary, newValue, parentId, parentType, type, primaryLabel, secondaryLabel);

        result.ifPresent(newComm -> {
            currentPrimary.ifPresent(commRepository::save); // Lưu cái cũ đã bị hạ cấp
            commRepository.save(newComm); // Lưu cái mới làm chính
        });
    }
}