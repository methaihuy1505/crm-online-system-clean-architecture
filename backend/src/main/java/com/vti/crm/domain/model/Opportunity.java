package com.vti.crm.domain.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Opportunity {

    private final Integer id;
    private String opportunityCode;
    private String name;
    private Integer customerId;                    // giữ Integer vì customerId chưa có CustomerId
    private Integer stage;
    private Integer status;
    private Integer lostReason;
    private Double totalAmount;
    private Double depositAmount;
    private Double remainingAmount;
    private Integer probability;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<OpportunityItem> items = new ArrayList<>();

    // Constructor private - chỉ Builder gọi được
    private Opportunity(OpportunityBuilder builder) {
        this.id              = builder.id;
        this.opportunityCode = Objects.requireNonNull(builder.opportunityCode, "Opportunity code is required");
        this.name            = Objects.requireNonNull(builder.name, "Name is required");
        this.customerId      = Objects.requireNonNull(builder.customerId, "Customer ID is required");
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
        this.createdAt       = builder.createdAt != null ? builder.createdAt : LocalDateTime.now();
        this.updatedAt       = builder.updatedAt != null ? builder.updatedAt : LocalDateTime.now();
        this.items           = new ArrayList<>(builder.items); // defensive copy
    }

    public void update(String name, Integer customerId, Integer stage, Integer status,
                       Integer lostReason, Double depositAmount, Integer probability, String description) {
        this.name        = Objects.requireNonNull(name, "Name is required");
        this.customerId  = Objects.requireNonNull(customerId, "Customer ID is required");
        this.stage       = Objects.requireNonNull(stage, "Stage is required");
        this.status      = Objects.requireNonNull(status, "Status is required");
        this.lostReason  = lostReason;
        this.depositAmount = depositAmount != null ? depositAmount : 0.0;
        this.probability = probability != null ? probability : 0;
        this.description = description;
        this.updatedAt   = LocalDateTime.now();
    }

    // SỬA: thêm recalculateTotal() — tính totalAmount từ items
    public void recalculateTotal() {
        if (items == null || items.isEmpty()) {
            this.totalAmount = 0.0;
        } else {
            this.totalAmount = items.stream()
                    .map(OpportunityItem::getFinalLineTotal)
                    .filter(Objects::nonNull)
                    .mapToDouble(v -> v.doubleValue())
                    .sum();
        }
    }

    // SỬA: thêm calculateRemaining() — tính remainingAmount = total - deposit
    public void calculateRemaining() {
        double total   = this.totalAmount != null ? this.totalAmount : 0.0;
        double deposit = this.depositAmount != null ? this.depositAmount : 0.0;
        this.remainingAmount = total - deposit;
    }
    // ====================== BUILDER ======================

//    Opportunity opportunity = new Opportunity.OpportunityBuilder()
//            .opportunityCode("OPP-2026-0001")
//            .name("Bán laptop cho công ty ABC")
//            .customerId(123)
//            .stage(OpportunityStage.QUALIFICATION)
//            .status(OpportunityStatus.OPEN)
//            .totalAmount(250000000.0)
//            .probability(70)
//            .description("Khách hàng tiềm năng")-
//            .addItem(new OpportunityItem(...))
//            .build();
    public static class OpportunityBuilder {
        private Integer id;
        private String opportunityCode;
        private String name;
        private Integer customerId;
        private Integer stage;
        private Integer status;
        private Integer lostReason;
        private Double totalAmount;
        private Double depositAmount;
        private Double remainingAmount;
        private Integer probability;
        private String description;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private List<OpportunityItem> items = new ArrayList<>();

        public OpportunityBuilder id(Integer id) {
            this.id = id;
            return this;
        }

        public OpportunityBuilder opportunityCode(String opportunityCode) {
            this.opportunityCode = opportunityCode;
            return this;
        }

        public OpportunityBuilder name(String name) {
            this.name = name;
            return this;
        }

        public OpportunityBuilder customerId(Integer customerId) {
            this.customerId = customerId;
            return this;
        }

        public OpportunityBuilder stage(Integer stage) {
            this.stage = stage;
            return this;
        }

        public OpportunityBuilder status(Integer status) {
            this.status = status;
            return this;
        }

        public OpportunityBuilder lostReason(Integer lostReason) {
            this.lostReason = lostReason;
            return this;
        }

        public OpportunityBuilder totalAmount(Double totalAmount) {
            this.totalAmount = totalAmount;
            return this;
        }

        public OpportunityBuilder depositAmount(Double depositAmount) {
            this.depositAmount = depositAmount;
            return this;
        }

        public OpportunityBuilder remainingAmount(Double remainingAmount) {
            this.remainingAmount = remainingAmount;
            return this;
        }

        public OpportunityBuilder probability(Integer probability) {
            this.probability = probability;
            return this;
        }

        public OpportunityBuilder description(String description) {
            this.description = description;
            return this;
        }

        public OpportunityBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public OpportunityBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

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
    public Integer getId() {return id;}
    public String getOpportunityCode() { return opportunityCode; }
    public String getName() { return name; }
    public Integer getCustomerId() { return customerId; }
    public Integer getStage() { return stage; }
    public Integer getStatus() { return status; }
    public Integer getLostReason() { return lostReason; }
    public Double getTotalAmount() { return totalAmount; }
    public Double getDepositAmount() { return depositAmount; }
    public Double getRemainingAmount() { return remainingAmount; }
    public Integer getProbability() { return probability; }
    public String getDescription() { return description; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public List<OpportunityItem> getItems() {return new ArrayList<>(items);} // defensive copy

}