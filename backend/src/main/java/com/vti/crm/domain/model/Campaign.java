package com.vti.crm.domain.model;

import lombok.Getter;
import java.time.LocalDate;

@Getter
public class Campaign {
    private Integer id;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;

    // Các field thống kê
    private Long totalLeads;
    private Long totalCustomers;
    private Double expectedRevenue;
    private Double actualRevenue;

    /**
     * Constructor DUY NHẤT (Public): Dùng để REHYDRATE (Phục dựng lại Entity từ Database).
     * MapStruct sẽ TỰ ĐỘNG nhìn thấy cái duy nhất này và gọi nó.
     */
    public Campaign(Integer id, String name, String description, LocalDate startDate, LocalDate endDate,
                    Long totalLeads, Long totalCustomers, Double expectedRevenue, Double actualRevenue) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalLeads = totalLeads != null ? totalLeads : 0L;
        this.totalCustomers = totalCustomers != null ? totalCustomers : 0L;
        this.expectedRevenue = expectedRevenue != null ? expectedRevenue : 0.0;
        this.actualRevenue = actualRevenue != null ? actualRevenue : 0.0;
    }

    /**
     * FACTORY METHOD (Static): Dùng để TẠO MỚI một Campaign (Từ UseCase gọi)
     * MapStruct sẽ BỎ QUA hàm static này.
     */
    public static Campaign create(String name, String description, LocalDate startDate, LocalDate endDate) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Lỗi nghiệp vụ: Tên chiến dịch không được để trống");
        }
        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Lỗi nghiệp vụ: Ngày bắt đầu không được lớn hơn ngày kết thúc");
        }

        // Gọi lại Constructor 1 ở trên và truyền null/0 cho các chỉ số
        return new Campaign(null, name, description, startDate, endDate, 0L, 0L, 0.0, 0.0);
    }

    /**
     * Hành vi 1: Cập nhật thông tin cơ bản
     */
    public void updateInfo(String name, String description, LocalDate startDate, LocalDate endDate) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Lỗi nghiệp vụ: Tên chiến dịch không được để trống");
        }
        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Lỗi nghiệp vụ: Ngày bắt đầu không được lớn hơn ngày kết thúc");
        }
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    /**
     * Hành vi 2: Cập nhật các chỉ số thống kê (Rich Behavior)
     */
    public void updateStatistics(Long totalLeads, Long totalCustomers, Double expectedRevenue, Double actualRevenue) {
        this.totalLeads = totalLeads;
        this.totalCustomers = totalCustomers;
        this.expectedRevenue = expectedRevenue != null ? expectedRevenue : 0.0;
        this.actualRevenue = actualRevenue != null ? actualRevenue : 0.0;
    }
}