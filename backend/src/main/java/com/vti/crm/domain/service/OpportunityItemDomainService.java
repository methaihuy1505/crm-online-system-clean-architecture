package com.vti.crm.domain.service;

import com.vti.crm.domain.model.OpportunityItem;
import com.vti.crm.domain.repository.IOpportunityItemRepository;
import com.vti.crm.domain.repository.IOpportunityRepository;
import com.vti.crm.domain.repository.IProductRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

public class OpportunityItemDomainService {

    private final IOpportunityItemRepository itemRepository;
    private final IOpportunityRepository opportunityRepository;
    private final IProductRepository productRepository;

    public OpportunityItemDomainService(IOpportunityItemRepository itemRepository,
                                        IOpportunityRepository opportunityRepository,
                                        IProductRepository productRepository) {
        this.itemRepository      = itemRepository;
        this.opportunityRepository = opportunityRepository;
        this.productRepository   = productRepository;
    }

    public OpportunityItem create(Integer opportunityId, Integer productId,
                                  Integer quantity, BigDecimal unitPrice,
                                  BigDecimal vatRate, BigDecimal discountRate,
                                  Integer lineItemNumber, String note) {
        validateOpportunityExists(opportunityId);
        var product = validateProductExists(productId);

        String productName = product.getName();
        String uomName     = resolveUomName(product);
        BigDecimal price   = unitPrice != null ? unitPrice : product.getBasePrice();
        BigDecimal vat     = vatRate != null ? vatRate : product.getVatRate();

        // Tự động cấp lineItemNumber, bỏ qua giá trị FE gửi lên
        int nextLineItemNumber = resolveNextLineItemNumber(opportunityId);

        OpportunityItem item = new OpportunityItem.OpportunityItemBuilder()
                .opportunityId(opportunityId)
                .productId(productId)
                .productName(productName)
                .uomName(uomName)
                .quantity(quantity)
                .unitPrice(price)
                .vatRate(vat)
                .discountRate(discountRate)
                .lineItemNumber(nextLineItemNumber) // dùng số tự động
                .note(note)
                .build();

        OpportunityItem saved = itemRepository.save(item);
        recalculateOpportunityTotal(opportunityId);
        return saved;
    }

    // Tính lineItemNumber tiếp theo = max hiện có + 1, bắt đầu từ 1
    private int resolveNextLineItemNumber(Integer opportunityId) {
        List<OpportunityItem> existing = itemRepository.findByOpportunityId(opportunityId);
        return existing.stream()
                .map(OpportunityItem::getLineItemNumber)
                .filter(Objects::nonNull)
                .mapToInt(Integer::intValue)
                .max()
                .orElse(0) + 1;
    }

    public OpportunityItem findById(Integer id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy item với id: " + id));
    }

    public List<OpportunityItem> findAll() {
        return itemRepository.findAll();
    }

    public List<OpportunityItem> findByOpportunityId(Integer opportunityId) {
        return itemRepository.findByOpportunityId(opportunityId);
    }

    public OpportunityItem update(Integer id, Integer productId,
                                  Integer quantity, BigDecimal unitPrice,
                                  BigDecimal vatRate, BigDecimal discountRate,
                                  Integer lineItemNumber, String note) {
        OpportunityItem existing = findById(id);
        var product = validateProductExists(productId);

        String productName = product.getName();
        String uomName     = resolveUomName(product);
        BigDecimal price   = unitPrice != null ? unitPrice : product.getBasePrice();
        BigDecimal vat     = vatRate != null ? vatRate : product.getVatRate();

        // Rebuild item với data mới — vì OpportunityItem là immutable
        OpportunityItem updated = new OpportunityItem.OpportunityItemBuilder()
                .id(existing.getId())
                .opportunityId(existing.getOpportunityId())
                .productId(productId)
                .productName(productName)
                .uomName(uomName)
                .quantity(quantity)
                .unitPrice(price)
                .vatRate(vat)
                .discountRate(discountRate)
                .lineItemNumber(lineItemNumber)
                .note(note)
                .createdAt(existing.getCreatedAt())
                .build();

        OpportunityItem saved = itemRepository.save(updated);
        recalculateOpportunityTotal(existing.getOpportunityId());
        return saved;
    }

    public void delete(Integer id) {
        OpportunityItem item = findById(id);
        itemRepository.delete(item);
        recalculateOpportunityTotal(item.getOpportunityId());
    }

    // ============ PRIVATE — Business Rules ============

    private void validateOpportunityExists(Integer opportunityId) {
        opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy cơ hội với id: " + opportunityId));
    }

    private com.vti.crm.domain.model.Product validateProductExists(Integer productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy sản phẩm với id: " + productId));
    }

    private String resolveUomName(com.vti.crm.domain.model.Product product) {
        // Product domain chỉ giữ uomID — tên UOM sẽ được resolve ở tầng trên nếu cần
        return null;
    }

    private void recalculateOpportunityTotal(Integer opportunityId) {
        // 1. Lấy tất cả các items hiện có của cơ hội này (bao gồm cả cái vừa save)
        List<OpportunityItem> items = itemRepository.findByOpportunityId(opportunityId);

        // 2. Tính tổng (Total Amount)
        double totalAmount = items.stream()
                .map(item -> item.getFinalLineTotal() != null ? item.getFinalLineTotal().doubleValue() : 0.0)
                .mapToDouble(Double::doubleValue)
                .sum();

        // 3. Lấy thông tin Opportunity để biết số tiền đã đặt cọc (Deposit)
        var opportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cơ hội"));

        double deposit = opportunity.getDepositAmount() != null ? opportunity.getDepositAmount() : 0.0;
        double remainingAmount = totalAmount - deposit;

        // 4. Gọi hàm update đơn giản vào DB (Hàm ta vừa tạo ở Bước 1)
        opportunityRepository.updateFinancialsManual(opportunityId, totalAmount, remainingAmount);
    }
}