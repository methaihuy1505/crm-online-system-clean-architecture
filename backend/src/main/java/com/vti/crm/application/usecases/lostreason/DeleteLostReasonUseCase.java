package com.vti.crm.application.usecases.lostreason;

import com.vti.crm.domain.service.LostReasonDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DeleteLostReasonUseCase {

    private final LostReasonDomainService lostReasonDomainService;

    public void execute(Integer id) {
        lostReasonDomainService.delete(id);
    }
}