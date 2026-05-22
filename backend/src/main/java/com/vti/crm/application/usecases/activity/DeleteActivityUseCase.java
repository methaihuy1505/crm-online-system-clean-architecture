package com.vti.crm.application.usecases.activity;

import com.vti.crm.domain.repository.IActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteActivityUseCase {
    private final IActivityRepository activityRepository;

    public void excute(Integer id) {
            activityRepository.deleteById(id);
        }
}
