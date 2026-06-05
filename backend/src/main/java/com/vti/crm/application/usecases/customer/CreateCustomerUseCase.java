package com.vti.crm.application.usecases.customer;

import com.vti.crm.domain.model.Contact;
import com.vti.crm.domain.model.Customer;
import com.vti.crm.domain.model.CommunicationDetail;
import com.vti.crm.domain.repository.*;
import com.vti.crm.domain.service.CustomerContactDomainService;
import com.vti.crm.interfaces.dto.request.customer.CustomerCreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CreateCustomerUseCase {

    private final ICustomerRepository customerRepository;
    private final IContactRepository contactRepository;
    private final ICommunicationRepository commRepository;

    // Khởi tạo Trọng tài
    private final CustomerContactDomainService domainService = new CustomerContactDomainService();

    @Transactional
    public Customer execute(CustomerCreateRequest request,Integer currentUserId) {
        Integer finalAssignedUserId = request.getAssignedUserId() != null
                ? request.getAssignedUserId()
                : currentUserId;
        // BƯỚC 1: Khởi tạo/Kéo data (Rich Entity sinh mã CUS-)
        Customer customer = Customer.create(
                request.getName(), request.getShortName(), request.getIsOrganization(),
                request.getTaxCode(), request.getCitizenId(), request.getFoundedDate(),
                request.getMainPhone(), request.getEmailOfficial(), request.getFax(),
                request.getWebsite(), request.getAddressCompany(), request.getAddressBilling(),
                request.getDescription(), request.getSourceId(), request.getCampaignId(),
                request.getStatusId(), request.getRankId(), request.getBranchId(),
                request.getProvinceId(),
                finalAssignedUserId,
                currentUserId
        );
        Customer savedCustomer = customerRepository.save(customer);

        // Lưu thông tin liên lạc mặc định cho Khách hàng
        saveDefaultComm(savedCustomer.getId(), "CUSTOMER", "PHONE", request.getMainPhone(), "Số chính");
        saveDefaultComm(savedCustomer.getId(), "CUSTOMER", "EMAIL", request.getEmailOfficial(), "Email chính");
        saveDefaultComm(savedCustomer.getId(), "CUSTOMER", "FAX", request.getFax(), "Fax");

        // BƯỚC 2: Nhờ Domain Service phán xử việc tạo Contact tráng gương
        var mirrorContactOpt = domainService.generateMirrorContactIfB2C(savedCustomer);

        // BƯỚC 3: Lưu thay đổi xuống DB (Nếu có tráng gương)
        mirrorContactOpt.ifPresent(contact -> {
            Contact savedContact = contactRepository.save(contact);

            // Lưu thông tin liên lạc riêng cho Contact tráng gương này
            saveDefaultComm(savedContact.getId(), "CONTACT", "PHONE", request.getMainPhone(), "Số chính");
            saveDefaultComm(savedContact.getId(), "CONTACT", "EMAIL", request.getEmailOfficial(), "Email chính");

            // Gán lại ID liên hệ chính cho Customer
            savedCustomer.assignPrimaryContact(savedContact.getId());
            customerRepository.save(savedCustomer);
        });

        return savedCustomer;
    }

    // Hàm Helper private phục vụ việc lưu Data
    private void saveDefaultComm(Integer id, String parentType, String type, String value, String label) {
        if (value != null && !value.isBlank()) {
            commRepository.save(CommunicationDetail.createNew(id, parentType, type, value, label, true));
        }
    }
}