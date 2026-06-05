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

    // --- DB CHỈ CÓ THỜI GIAN ---
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;

    public Contact(Integer id, Integer customerId, String firstName, String lastName, String jobTitle, LocalDate birthday, String personalEmail, String personalPhone, Boolean isPrimary, LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime deletedAt) {
        this.id = id; this.customerId = customerId; this.firstName = firstName; this.lastName = lastName; this.jobTitle = jobTitle; this.birthday = birthday; this.personalEmail = personalEmail; this.personalPhone = personalPhone; this.isPrimary = isPrimary;
        this.createdAt = createdAt; this.updatedAt = updatedAt; this.deletedAt = deletedAt;
    }

    public static Contact create(Integer customerId, String firstName, String lastName, String jobTitle, LocalDate birthday, String personalEmail, String personalPhone, Boolean isPrimary) {
        return new Contact(null, customerId, firstName, lastName, jobTitle, birthday, personalEmail, personalPhone, isPrimary != null ? isPrimary : false, LocalDateTime.now(), null, null);
    }

    public static Contact createMirrorForB2C(Customer customer) {
        String fName = ""; String lName = "";
        String fullName = customer.getName().trim();
        int lastSpaceIndex = fullName.lastIndexOf(" ");
        if (lastSpaceIndex > 0) { lName = fullName.substring(0, lastSpaceIndex).trim(); fName = fullName.substring(lastSpaceIndex + 1).trim(); }
        else { fName = fullName; }
        return new Contact(null, customer.getId(), fName, lName, "Cá nhân", customer.getFoundedDate(), customer.getEmailOfficial(), customer.getMainPhone(), true, LocalDateTime.now(), null, null);
    }
    public static Contact createFromLead(Lead lead, Integer customerId) {
        String fName = "";
        String lName = "";

        String fullName = lead.getFullName().trim();
        int lastSpaceIndex = fullName.lastIndexOf(" ");
        if (lastSpaceIndex > 0) {
            lName = fullName.substring(0, lastSpaceIndex).trim();
            fName = fullName.substring(lastSpaceIndex + 1).trim();
        } else {
            fName = fullName;
        }

        // Xác định chức danh: Nếu Lead thuộc công ty -> "Người đại diện", nếu không -> "Cá nhân"
        boolean isB2B = lead.getCompanyName() != null && !lead.getCompanyName().isBlank();
        String jobTitle = isB2B ? "Người đại diện" : "Cá nhân";

        return new Contact(
                null, customerId, fName, lName, jobTitle, null,
                lead.getEmail(), lead.getPhone(), true,
                LocalDateTime.now(), null, null
        );
    }

    public void updateInfo(String firstName, String lastName, String jobTitle, LocalDate birthday, String personalEmail, String personalPhone, Boolean isPrimary) {
        this.firstName = firstName; this.lastName = lastName; this.jobTitle = jobTitle; this.birthday = birthday; this.personalEmail = personalEmail; this.personalPhone = personalPhone;
        if (isPrimary != null) { this.isPrimary = isPrimary; }
        this.updatedAt = LocalDateTime.now();
    }

    public void demoteFromPrimary() {
        this.isPrimary = false;
        this.updatedAt = LocalDateTime.now();
    }

    // TRẢ LẠI NHƯ CŨ
    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }
}