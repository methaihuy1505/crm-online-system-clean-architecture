package com.vti.crm.application.usecases.lostreason;

import com.vti.crm.domain.model.LostReason;
import com.vti.crm.domain.service.LostReasonDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CreateLostReasonUseCase {

    private final LostReasonDomainService lostReasonDomainService;

    public LostReason execute(String code, String name, String description) {
        return lostReasonDomainService.create(code, name, description);
    }
}