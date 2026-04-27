package com.vti.crm.application.usecases.lostreason;

import com.vti.crm.domain.model.LostReason;
import com.vti.crm.domain.service.LostReasonDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UpdateLostReasonUseCase {

    private final LostReasonDomainService lostReasonDomainService;

    public LostReason execute(Integer id, String name, String description) {
        return lostReasonDomainService.update(id, name, description);
    }
}