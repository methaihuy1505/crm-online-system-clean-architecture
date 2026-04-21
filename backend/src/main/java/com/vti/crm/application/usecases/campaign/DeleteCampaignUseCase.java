package com.vti.crm.application.usecases.campaign;

import com.vti.crm.domain.repository.ICampaignRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeleteCampaignUseCase {
    private final ICampaignRepository campaignRepository;

    @Transactional
    public void execute(Integer id) {
        // Kiểm tra tồn tại trước khi xóa (hoặc để Repository xử lý)
        campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chiến dịch với ID: " + id));

        campaignRepository.delete(id);
    }
}