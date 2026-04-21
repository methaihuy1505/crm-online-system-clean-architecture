package com.vti.crm.domain.model;

import lombok.Getter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class Contact {
    private Integer id;
    private Integer customerId;
    private String firstName;
    private String lastName;
    private String jobTitle;
    private LocalDate birthday;
    private String personalEmail;
    private String personalPhone;
    private Boolean isPrimary;

    private LocalDateTime createdAt;
    private LocalDateTime deletedAt;

    // Constructor 1: Phục dựng từ DB
    public Contact(Integer id, Integer customerId, String firstName, String lastName, String jobTitle, LocalDate birthday, String personalEmail, String personalPhone, Boolean isPrimary, LocalDateTime createdAt, LocalDateTime deletedAt) {
        this.id = id;
        this.customerId = customerId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.jobTitle = jobTitle;
        this.birthday = birthday;
        this.personalEmail = personalEmail;
        this.personalPhone = personalPhone;
        this.isPrimary = isPrimary;
        this.createdAt = createdAt;
        this.deletedAt = deletedAt;
    }

    // Hành vi: Khởi tạo mới thông thường
    public static Contact create(Integer customerId, String firstName, String lastName, String jobTitle, LocalDate birthday, String personalEmail, String personalPhone, Boolean isPrimary) {
        return new Contact(null, customerId, firstName, lastName, jobTitle, birthday, personalEmail, personalPhone, isPrimary != null ? isPrimary : false, LocalDateTime.now(), null);
    }

    // Hành vi: TỰ ĐỘNG tạo Contact tráng gương từ Customer B2C (Cắt tên tại đây)
    public static Contact createMirrorForB2C(Customer customer) {
        String fName = "";
        String lName = "";

        String fullName = customer.getName().trim();
        int lastSpaceIndex = fullName.lastIndexOf(" ");
        if (lastSpaceIndex > 0) {
            lName = fullName.substring(0, lastSpaceIndex).trim();
            fName = fullName.substring(lastSpaceIndex + 1).trim();
        } else {
            fName = fullName;
        }

        return new Contact(null, customer.getId(), fName, lName, "Cá nhân", customer.getFoundedDate(), customer.getEmailOfficial(), customer.getMainPhone(), true, LocalDateTime.now(), null);
    }

    // Hành vi: Cập nhật
    public void updateInfo(String firstName, String lastName, String jobTitle, LocalDate birthday, String personalEmail, String personalPhone, Boolean isPrimary) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.jobTitle = jobTitle;
        this.birthday = birthday;
        this.personalEmail = personalEmail;
        this.personalPhone = personalPhone;
        if (isPrimary != null) {
            this.isPrimary = isPrimary;
        }
    }

    // Hành vi: Hạ cấp (khi người khác được làm primary)
    public void demoteFromPrimary() {
        this.isPrimary = false;
    }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }
}