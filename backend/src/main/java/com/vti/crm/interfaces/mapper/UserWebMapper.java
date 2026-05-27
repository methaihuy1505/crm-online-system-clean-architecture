package com.vti.crm.interfaces.mapper;

import com.vti.crm.domain.model.User;
import com.vti.crm.interfaces.dto.request.user.CreateUserRequest;
import com.vti.crm.interfaces.dto.response.user.UserResponse;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserWebMapper {

    UserResponse toResponse(User domain);

    default User toDomain(CreateUserRequest request) {
        if (request == null) {
            return null;
        }

        return new User(
                request.getUsername(),
                request.getFullName(),
                request.getPassword(),
                request.getEmail(),
                request.getPhone(),
                request.getRoleId(),
                request.getBranchId(),
                request.getTeamId()
        );
    }
}