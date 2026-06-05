package com.vti.crm.application.usecases.lead;

import com.vti.crm.domain.model.CommunicationDetail;
import com.vti.crm.domain.model.Contact;
import com.vti.crm.domain.model.Customer;
import com.vti.crm.domain.model.Lead;
import com.vti.crm.domain.repository.ICommunicationRepository;
import com.vti.crm.domain.repository.IContactRepository;
import com.vti.crm.domain.repository.ICustomerRepository;
import com.vti.crm.domain.repository.ILeadRepository;
import com.vti.crm.domain.service.LeadConversionDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ConvertLeadUseCase {

    private final ILeadRepository leadRepository;
    private final ICustomerRepository customerRepository;
    private final IContactRepository contactRepository;
    private final ICommunicationRepository commRepository;

    private final LeadConversionDomainService conversionDomainService = new LeadConversionDomainService();

    @Transactional
    public void execute(Integer leadId, Integer currentUserId) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy Khách hàng tiềm năng với ID: " + leadId));

        final Integer CONVERTED_STATUS_ID = 3;

        // 1. TẠO CUSTOMER (Sẽ lấy tên công ty nếu là B2B)
        Customer newCustomer = conversionDomainService.convertToCustomer(lead, CONVERTED_STATUS_ID, currentUserId);

        leadRepository.save(lead);
        Customer savedCustomer = customerRepository.save(newCustomer);

        // 2. LƯU THÔNG TIN LIÊN LẠC CHO CUSTOMER ĐÓ
        saveDefaultComm(savedCustomer.getId(), "CUSTOMER", "PHONE", savedCustomer.getMainPhone(), "Số chính");
        saveDefaultComm(savedCustomer.getId(), "CUSTOMER", "EMAIL", savedCustomer.getEmailOfficial(), "Email chính");

        // 3. LUÔN LUÔN TẠO 1 CONTACT TỪ LEAD
        Contact newContact = Contact.createFromLead(lead, savedCustomer.getId());
        Contact savedContact = contactRepository.save(newContact);

        // 4. LƯU THÔNG TIN LIÊN LẠC CHO CONTACT (Số cá nhân của anh Vinh)
        saveDefaultComm(savedContact.getId(), "CONTACT", "PHONE", savedContact.getPersonalPhone(), "Số cá nhân");
        saveDefaultComm(savedContact.getId(), "CONTACT", "EMAIL", savedContact.getPersonalEmail(), "Email cá nhân");

        // 5. SET ANH VINH LÀM NGƯỜI LIÊN HỆ CHÍNH CỦA VTI
        savedCustomer.assignPrimaryContact(savedContact.getId());
        customerRepository.save(savedCustomer);
    }

    private void saveDefaultComm(Integer id, String parentType, String type, String value, String label) {
        if (value != null && !value.isBlank()) {
            commRepository.save(CommunicationDetail.createNew(id, parentType, type, value, label, true));
        }
    }
}