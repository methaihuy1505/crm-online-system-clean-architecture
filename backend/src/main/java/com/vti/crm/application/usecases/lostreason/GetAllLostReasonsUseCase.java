package com.vti.crm.application.usecases.lostreason;

import com.vti.crm.domain.model.LostReason;
import com.vti.crm.domain.service.LostReasonDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetAllLostReasonsUseCase {

    private final LostReasonDomainService lostReasonDomainService;

    public List<LostReason> execute() {
        return lostReasonDomainService.findAll();
    }
}