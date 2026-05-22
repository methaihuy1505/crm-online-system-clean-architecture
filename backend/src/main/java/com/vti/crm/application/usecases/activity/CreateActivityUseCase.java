package com.vti.crm.application.usecases.activity;

import com.vti.crm.domain.model.Activity;
import com.vti.crm.domain.repository.IActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateActivityUseCase {
    private final IActivityRepository activityRepository;
    public Activity execute(Activity activity) {
        //gọi để check logic ,gán default,...
        activity.initializeForCreation();
        //gọi repos lưu vào db
        return activityRepository.save(activity);
    }
}
