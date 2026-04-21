package com.vti.crm.domain.model;

import lombok.Getter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
public class Customer {
    private Integer id;
    private String customerCode;
    private String name;
    private String shortName;
    private Boolean isOrganization;
    private String taxCode;
    private String citizenId;
    private LocalDate foundedDate;
    private String website;
    private String emailOfficial;
    private String mainPhone;
    private String fax;
    private String addressCompany;
    private String addressBilling;
    private String description;

    // Khóa ngoại
    private Integer sourceId;
    private Integer campaignId;
    private Integer statusId;
    private Integer rankId;
    private Integer primaryContactId;
    private Integer branchId;
    private Integer provinceId;
    private Integer assignedUserId;

    private LocalDateTime createdAt;
    private LocalDateTime deletedAt;

    // Constructor 1: Phục dựng từ DB (Rehydrate) cho MapStruct
    public Customer(Integer id, String customerCode, String name, String shortName, Boolean isOrganization, String taxCode, String citizenId, LocalDate foundedDate, String website, String emailOfficial, String mainPhone, String fax, String addressCompany, String addressBilling, String description, Integer sourceId, Integer campaignId, Integer statusId, Integer rankId, Integer primaryContactId, Integer branchId, Integer provinceId, Integer assignedUserId, LocalDateTime createdAt, LocalDateTime deletedAt) {
        this.id = id;
        this.customerCode = customerCode;
        this.name = name;
        this.shortName = shortName;
        this.isOrganization = isOrganization;
        this.taxCode = taxCode;
        this.citizenId = citizenId;
        this.foundedDate = foundedDate;
        this.website = website;
        this.emailOfficial = emailOfficial;
        this.mainPhone = mainPhone;
        this.fax = fax;
        this.addressCompany = addressCompany;
        this.addressBilling = addressBilling;
        this.description = description;
        this.sourceId = sourceId;
        this.campaignId = campaignId;
        this.statusId = statusId;
        this.rankId = rankId;
        this.primaryContactId = primaryContactId;
        this.branchId = branchId;
        this.provinceId = provinceId;
        this.assignedUserId = assignedUserId;
        this.createdAt = createdAt;
        this.deletedAt = deletedAt;
    }

    // Hành vi: Khởi tạo mới (Sinh tự động CustomerCode)
    public static Customer create(String name, String shortName, Boolean isOrganization, String taxCode, String citizenId, LocalDate foundedDate, String mainPhone, String emailOfficial, String fax, String website, String addressCompany, String addressBilling, String description, Integer sourceId, Integer campaignId, Integer statusId, Integer rankId, Integer branchId, Integer provinceId, Integer assignedUserId) {
        String generatedCode = "CUS-" + System.currentTimeMillis();
        return new Customer(null, generatedCode, name, shortName, isOrganization, taxCode, citizenId, foundedDate, website, emailOfficial, mainPhone, fax, addressCompany, addressBilling, description, sourceId, campaignId, statusId, rankId, null, branchId, provinceId, assignedUserId, LocalDateTime.now(), null);
    }

    // Hành vi: Cập nhật thông tin
    public void updateInfo(String name, String shortName, Boolean isOrganization, String taxCode, String citizenId, LocalDate foundedDate, String mainPhone, String emailOfficial, String fax, String website, String addressCompany, String addressBilling, String description, Integer sourceId, Integer campaignId, Integer statusId, Integer rankId, Integer branchId, Integer provinceId, Integer assignedUserId) {
        this.name = name;
        this.shortName = shortName;
        this.isOrganization = isOrganization;
        this.taxCode = taxCode;
        this.citizenId = citizenId;
        this.foundedDate = foundedDate;
        this.mainPhone = mainPhone;
        this.emailOfficial = emailOfficial;
        this.fax = fax;
        this.website = website;
        this.addressCompany = addressCompany;
        this.addressBilling = addressBilling;
        this.description = description;
        this.sourceId = sourceId;
        this.campaignId = campaignId;
        this.statusId = statusId;
        this.rankId = rankId;
        this.branchId = branchId;
        this.provinceId = provinceId;
        this.assignedUserId = assignedUserId;
    }

    // Hành vi: Cập nhật ID của người liên hệ chính
    public void assignPrimaryContact(Integer contactId) {
        this.primaryContactId = contactId;
    }

    // Hành vi: Đồng bộ ngược từ Contact (Nếu Contact bị đổi số/email)
    public void syncFromPrimaryContact(String newPhone, String newEmail) {
        if (newPhone != null) this.mainPhone = newPhone;
        if (newEmail != null) this.emailOfficial = newEmail;
    }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }
}