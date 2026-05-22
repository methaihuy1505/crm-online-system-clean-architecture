package com.vti.crm.application.usecases.lostreason;

import com.vti.crm.domain.model.LostReason;
import com.vti.crm.domain.service.LostReasonDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetLostReasonByIdUseCase {

    private final LostReasonDomainService lostReasonDomainService;

    public LostReason execute(Integer id) {
        return lostReasonDomainService.findById(id);
    }
}