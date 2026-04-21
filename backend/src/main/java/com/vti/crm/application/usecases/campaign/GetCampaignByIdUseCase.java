package com.vti.crm.application.usecases.campaign;

import com.vti.crm.domain.model.Campaign;
import com.vti.crm.domain.model.Lead;
import com.vti.crm.domain.repository.ICampaignRepository;
import com.vti.crm.domain.repository.ILeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GetCampaignByIdUseCase {
    private final ICampaignRepository campaignRepository;
    private final ILeadRepository leadRepository;

    // Tiêm ICustomerRepository vào nếu bạn đã làm xong, nếu chưa thì comment lại
    //private final ICustomerRepository customerRepository;

    public Campaign execute(Integer id) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chiến dịch với ID: " + id));

        // 1. Nhờ thủ kho lấy danh sách Leads thuộc Campaign này
        List<Lead> campaignLeads = leadRepository.findByCampaignId(id);

        // Nhờ thủ kho lấy số lượng Customer (Nếu chưa có Repo này thì hardcode = 0L)
        Long totalCustomers = 0L;

        // 2. Tính toán Dự thu (Expected Revenue) - Lead Status 1 (Mới) và 2 (Đang liên hệ)
        double expected = campaignLeads.stream()
                .filter(l -> l.getStatusId() != null && (l.getStatusId() == 1 || l.getStatusId() == 2))
                .map(l -> l.getExpectedRevenue() != null ? l.getExpectedRevenue() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();

        // 3. Tính toán Thực thu (Actual Revenue) - Lead Status 3 (Đã chuyển đổi) và 4 (Phát sinh giao dịch)
        double actual = campaignLeads.stream()
                .filter(l -> l.getStatusId() != null && (l.getStatusId() == 3 || l.getStatusId() == 4))
                .map(l -> l.getExpectedRevenue() != null ? l.getExpectedRevenue() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .doubleValue();

        // 4. Bơm data vào Rich Entity để nó tự cập nhật trạng thái
        campaign.updateStatistics((long) campaignLeads.size(), totalCustomers, expected, actual);

        // 5. Trả về cho Controller map ra Response
        return campaign;
    }
}