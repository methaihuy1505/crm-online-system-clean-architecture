package com.vti.crm.domain.service;

import com.vti.crm.domain.model.Contact;
import com.vti.crm.domain.model.Customer;

import java.util.List;
import java.util.Optional;

public class CustomerContactDomainService {

    // Nghiệp vụ 1: Quyết định có tạo Contact tráng gương hay không (B2C)
    public Optional<Contact> generateMirrorContactIfB2C(Customer customer) {
        if (Boolean.FALSE.equals(customer.getIsOrganization())) {
            return Optional.of(Contact.createMirrorForB2C(customer));
        }
        return Optional.empty();
    }

    // Nghiệp vụ 2: Xử lý Liên hệ chính (Hạ cấp người cũ, thăng cấp người mới)
    public void processPrimaryContactAssignment(Customer customer, Contact newPrimary, List<Contact> currentPrimaries) {
        for (Contact c : currentPrimaries) {
            if (!c.getId().equals(newPrimary.getId())) {
                c.demoteFromPrimary(); // Gọi hành vi của Rich Entity
            }
        }
        customer.assignPrimaryContact(newPrimary.getId());
    }

    // Nghiệp vụ 3: Đồng bộ ngược thông tin từ Contact (Cá nhân) lên Customer
    // Trả về true nếu có sự thay đổi thực sự
    public boolean syncB2CContactToCustomer(Customer customer, Contact contact) {
        if (Boolean.FALSE.equals(customer.getIsOrganization()) &&
                contact.getId().equals(customer.getPrimaryContactId())) {

            boolean phoneChanged = contact.getPersonalPhone() != null && !contact.getPersonalPhone().equals(customer.getMainPhone());
            boolean emailChanged = contact.getPersonalEmail() != null && !contact.getPersonalEmail().equals(customer.getEmailOfficial());

            if (phoneChanged || emailChanged) {
                customer.syncFromPrimaryContact(contact.getPersonalPhone(), contact.getPersonalEmail());
                return true;
            }
        }
        return false;
    }


    // Xử lý ngắt kết nối khi Contact bị xóa mềm
    public boolean processContactDeletion(Customer customer, Contact contact) {
        // Nếu người bị xóa đúng là Liên hệ chính của công ty
        if (contact.getId().equals(customer.getPrimaryContactId())) {
            customer.assignPrimaryContact(null); // Gỡ chức danh
            return true; // Trả về true để báo hiệu cho UseCase biết Customer đã bị thay đổi
        }
        return false;
    }
}