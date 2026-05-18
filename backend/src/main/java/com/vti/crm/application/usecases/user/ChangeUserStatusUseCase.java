package com.vti.crm.application.usecases.user;

import com.vti.crm.domain.model.User;
import com.vti.crm.domain.model.UserStatus;
import com.vti.crm.domain.repository.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChangeUserStatusUseCase {
    private final IUserRepository repository;

    public void execute(Long id, UserStatus status) {
        User user = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy user với id: " + id));
        if (status == null) {
            throw new IllegalArgumentException("Trạng thái không được để trống");
        }
        if (status == UserStatus.ACTIVE) {
            user.activate();
        } else if (status == UserStatus.INACTIVE) {
            user.deactivate();
        }
        repository.save(user);
    }
}
