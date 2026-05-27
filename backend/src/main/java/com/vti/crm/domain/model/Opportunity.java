package com.vti.crm.domain.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Opportunity {

    private final Integer id;
    private String opportunityCode;
    private String name;
    private Integer customerId;
    private Integer campaignId;
    private Integer stage;
    private Integer status;
    private Integer lostReason;
    private Double totalAmount;
    private Double depositAmount;
    private Double remainingAmount;
    private Integer probability;
    private String description;
    private LocalDateTime nextFollowUpDate;
    private String currencyCode;
    private LocalDate expectedCloseDate;
    private LocalDate actualCloseDate;
    private Integer assignedTo;
    private Integer createdBy;
    private Integer updatedBy;
    private LocalDateTime deletedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<OpportunityItem> items = new ArrayList<>();

    // ====================== CONSTRUCTOR ======================

    private Opportunity(OpportunityBuilder builder) {
        this.id              = builder.id;
        this.opportunityCode = Objects.requireNonNull(builder.opportunityCode, "Opportunity code is required");
        this.name            = Objects.requireNonNull(builder.name, "Name is required");
        this.customerId      = Objects.requireNonNull(builder.customerId, "Customer ID is required");
        this.campaignId      = builder.campaignId != null ? builder.campaignId : 0;
        this.stage           = Objects.requireNonNull(builder.stage, "Stage is required");
        this.status          = Objects.requireNonNull(builder.status, "Status is required");
        this.lostReason      = builder.lostReason;
        this.totalAmount     = Objects.requireNonNull(builder.totalAmount, "Total amount is required");
        this.depositAmount   = builder.depositAmount != null ? builder.depositAmount : 0.0;
        this.remainingAmount = builder.remainingAmount != null
                ? builder.remainingAmount
                : this.totalAmount;
        this.probability     = builder.probability != null ? builder.probability : 0;
        this.description     = builder.description;
        this.nextFollowUpDate  = builder.nextFollowUpDate;
        this.currencyCode      = builder.currencyCode != null ? builder.currencyCode : "VND";
        this.expectedCloseDate = builder.expectedCloseDate;
        this.actualCloseDate   = builder.actualCloseDate;
        this.assignedTo        = builder.assignedTo != null ? builder.assignedTo : 1;
        this.createdBy         = builder.createdBy  != null ? builder.createdBy  : 1;
        this.updatedBy         = builder.updatedBy  != null ? builder.updatedBy  : 1;
        this.deletedAt         = builder.deletedAt;
        this.createdAt         = builder.createdAt != null ? builder.createdAt : LocalDateTime.now();
        this.updatedAt         = builder.updatedAt != null ? builder.updatedAt : LocalDateTime.now();
        this.items             = new ArrayList<>(builder.items); // defensive copy
    }

    // ====================== DOMAIN METHODS ======================

    /**
     * Cập nhật toàn bộ thông tin của Opportunity (bao gồm tất cả các trường có thể thay đổi).
     * updatedAt tự động set = now().
     */
    public void update(
            String name,
            Integer customerId,
            Integer campaignId,
            Integer stage,
            Integer status,
            Integer lostReason,
            Double depositAmount,
            Integer probability,
            String description,
            LocalDateTime nextFollowUpDate,
            String currencyCode,
            LocalDate expectedCloseDate,
            LocalDate actualCloseDate,
            Integer assignedTo,
            Integer updatedBy
    ) {
        this.name              = Objects.requireNonNull(name, "Name is required");
        this.customerId        = Objects.requireNonNull(customerId, "Customer ID is required");
        this.campaignId        = campaignId != null ? campaignId : 0;
        this.stage             = Objects.requireNonNull(stage, "Stage is required");
        this.status            = Objects.requireNonNull(status, "Status is required");
        this.lostReason        = lostReason;
        this.depositAmount     = depositAmount != null ? depositAmount : 0.0;
        this.probability       = probability != null ? probability : 0;
        this.description       = description;
        this.nextFollowUpDate  = nextFollowUpDate;
        this.currencyCode      = currencyCode != null ? currencyCode : "VND";
        this.expectedCloseDate = expectedCloseDate;
        this.actualCloseDate   = actualCloseDate;
        this.assignedTo        = assignedTo != null ? assignedTo : 0;
        this.updatedBy         = updatedBy  != null ? updatedBy  : 0;
        this.updatedAt         = LocalDateTime.now();
    }

    /**
     * Tính lại totalAmount từ danh sách items.
     * Gọi sau khi thêm/xóa/sửa items.
     */
    public void recalculateTotal() {
        if (items == null || items.isEmpty()) {
            this.totalAmount = 0.0;
        } else {
            this.totalAmount = items.stream()
                    .map(OpportunityItem::getFinalLineTotal)
                    .filter(Objects::nonNull)
                    .mapToDouble(Number::doubleValue)
                    .sum();
        }
    }

    /**
     * Tính remainingAmount = totalAmount - depositAmount.
     * Gọi sau recalculateTotal() hoặc sau khi deposit thay đổi.
     */
    public void calculateRemaining() {
        double total   = this.totalAmount   != null ? this.totalAmount   : 0.0;
        double deposit = this.depositAmount != null ? this.depositAmount : 0.0;
        this.remainingAmount = total - deposit;
    }

    /**
     * Soft delete: đánh dấu xóa mềm.
     */
    public void delete(Integer deletedBy) {
        this.deletedAt = LocalDateTime.now();
        this.updatedBy = deletedBy != null ? deletedBy : 0;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Kiểm tra opportunity đã bị xóa mềm chưa.
     */
    public boolean isDeleted() {
        return this.deletedAt != null;
    }

    /**
     * Thêm một item vào danh sách, rồi tự recalculate.
     */
    public void addItem(OpportunityItem item) {
        Objects.requireNonNull(item, "OpportunityItem must not be null");
        this.items.add(item);
        recalculateTotal();
        calculateRemaining();
    }

    /**
     * Xóa item theo index, rồi tự recalculate.
     */
    public void removeItem(int index) {
        if (index < 0 || index >= items.size()) {
            throw new IndexOutOfBoundsException("Invalid item index: " + index);
        }
        this.items.remove(index);
        recalculateTotal();
        calculateRemaining();
    }

    /**
     * Thay toàn bộ danh sách items, rồi tự recalculate.
     */
    public void replaceItems(List<OpportunityItem> newItems) {
        this.items = newItems != null ? new ArrayList<>(newItems) : new ArrayList<>();
        recalculateTotal();
        calculateRemaining();
    }

    // ====================== BUILDER ======================

    /**
     * Ví dụ sử dụng:
     *
     * Opportunity opportunity = new Opportunity.OpportunityBuilder()
     *         .opportunityCode("OPP-2026-0001")
     *         .name("Bán laptop cho công ty ABC")
     *         .customerId(123)
     *         .campaignId(5)
     *         .stage(1)
     *         .status(1)
     *         .totalAmount(250_000_000.0)
     *         .depositAmount(50_000_000.0)
     *         .probability(70)
     *         .currencyCode("VND")
     *         .expectedCloseDate(LocalDate.of(2026, 6, 30))
     *         .nextFollowUpDate(LocalDateTime.now().plusDays(3))
     *         .assignedTo(10)
     *         .createdBy(1)
     *         .description("Khách hàng tiềm năng")
     *         .addItem(new OpportunityItem(...))
     *         .build();
     */
    public static class OpportunityBuilder {
        private Integer id;
        private String opportunityCode;
        private String name;
        private Integer customerId;
        private Integer campaignId;
        private Integer stage;
        private Integer status;
        private Integer lostReason;
        private Double totalAmount;
        private Double depositAmount;
        private Double remainingAmount;
        private Integer probability;
        private String description;
        private LocalDateTime nextFollowUpDate;
        private String currencyCode;
        private LocalDate expectedCloseDate;
        private LocalDate actualCloseDate;
        private Integer assignedTo;
        private Integer createdBy;
        private Integer updatedBy;
        private LocalDateTime deletedAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private List<OpportunityItem> items = new ArrayList<>();

        public OpportunityBuilder id(Integer id)                             { this.id = id; return this; }
        public OpportunityBuilder opportunityCode(String opportunityCode)    { this.opportunityCode = opportunityCode; return this; }
        public OpportunityBuilder name(String name)                          { this.name = name; return this; }
        public OpportunityBuilder customerId(Integer customerId)             { this.customerId = customerId; return this; }
        public OpportunityBuilder campaignId(Integer campaignId)             { this.campaignId = campaignId; return this; }
        public OpportunityBuilder stage(Integer stage)                       { this.stage = stage; return this; }
        public OpportunityBuilder status(Integer status)                     { this.status = status; return this; }
        public OpportunityBuilder lostReason(Integer lostReason)             { this.lostReason = lostReason; return this; }
        public OpportunityBuilder totalAmount(Double totalAmount)            { this.totalAmount = totalAmount; return this; }
        public OpportunityBuilder depositAmount(Double depositAmount)        { this.depositAmount = depositAmount; return this; }
        public OpportunityBuilder remainingAmount(Double remainingAmount)    { this.remainingAmount = remainingAmount; return this; }
        public OpportunityBuilder probability(Integer probability)           { this.probability = probability; return this; }
        public OpportunityBuilder description(String description)            { this.description = description; return this; }
        public OpportunityBuilder nextFollowUpDate(LocalDateTime v)          { this.nextFollowUpDate = v; return this; }
        public OpportunityBuilder currencyCode(String v)                     { this.currencyCode = v; return this; }
        public OpportunityBuilder expectedCloseDate(LocalDate v)             { this.expectedCloseDate = v; return this; }
        public OpportunityBuilder actualCloseDate(LocalDate v)               { this.actualCloseDate = v; return this; }
        public OpportunityBuilder assignedTo(Integer v)                      { this.assignedTo = v; return this; }
        public OpportunityBuilder createdBy(Integer v)                       { this.createdBy = v; return this; }
        public OpportunityBuilder updatedBy(Integer v)                       { this.updatedBy = v; return this; }
        public OpportunityBuilder deletedAt(LocalDateTime v)                 { this.deletedAt = v; return this; }
        public OpportunityBuilder createdAt(LocalDateTime createdAt)         { this.createdAt = createdAt; return this; }
        public OpportunityBuilder updatedAt(LocalDateTime updatedAt)         { this.updatedAt = updatedAt; return this; }

        public OpportunityBuilder items(List<OpportunityItem> items) {
            this.items = items != null ? new ArrayList<>(items) : new ArrayList<>();
            return this;
        }

        public OpportunityBuilder addItem(OpportunityItem item) {
            this.items.add(item);
            return this;
        }

        public Opportunity build() {
            if (probability != null && (probability < 0 || probability > 100)) {
                throw new IllegalArgumentException("Probability phải nằm trong khoảng 0-100");
            }
            return new Opportunity(this);
        }
    }

    // ====================== GETTERS ======================

    public Integer getId()                        { return id; }
    public String getOpportunityCode()            { return opportunityCode; }
    public String getName()                       { return name; }
    public Integer getCustomerId()                { return customerId; }
    public Integer getCampaignId()                { return campaignId; }
    public Integer getStage()                     { return stage; }
    public Integer getStatus()                    { return status; }
    public Integer getLostReason()                { return lostReason; }
    public Double getTotalAmount()                { return totalAmount; }
    public Double getDepositAmount()              { return depositAmount; }
    public Double getRemainingAmount()            { return remainingAmount; }
    public Integer getProbability()               { return probability; }
    public String getDescription()                { return description; }
    public LocalDateTime getNextFollowUpDate()    { return nextFollowUpDate; }
    public String getCurrencyCode()               { return currencyCode; }
    public LocalDate getExpectedCloseDate()       { return expectedCloseDate; }
    public LocalDate getActualCloseDate()         { return actualCloseDate; }
    public Integer getAssignedTo()                { return assignedTo; }
    public Integer getCreatedBy()                 { return createdBy; }
    public Integer getUpdatedBy()                 { return updatedBy; }
    public LocalDateTime getDeletedAt()           { return deletedAt; }
    public LocalDateTime getCreatedAt()           { return createdAt; }
    public LocalDateTime getUpdatedAt()           { return updatedAt; }
    public List<OpportunityItem> getItems()       { return new ArrayList<>(items); } // defensive copy
}