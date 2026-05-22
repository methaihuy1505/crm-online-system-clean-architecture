package com.vti.crm.application.usecases.activity;

import com.vti.crm.domain.model.Activity;
import com.vti.crm.domain.repository.IActivityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UpdateActivityUseCase {
    private final IActivityRepository activityRepository;


    public Activity execute(Integer id, Activity updatedData) {
        System.out.println(updatedData.getIsCompleted());
        // 1. Lấy dữ liệu cũ từ Database
        Activity existingActivity = activityRepository.findById(id).
                orElseThrow(() -> new IllegalArgumentException("Không tìm thấy Activity với ID: " + id));

        // 2. Rich Entity: Gọi thực thể CŨ tự cập nhật nó bằng dữ liệu MỚI
        existingActivity.updateFrom(updatedData);

        // 3. Lưu xuống Database
        return activityRepository.save(existingActivity);
    }
}
