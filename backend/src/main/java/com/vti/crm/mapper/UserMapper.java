package com.vti.crm.mapper;

import com.vti.crm.dto.request.UserCreationRequest;
import com.vti.crm.dto.request.UserUpdateRequest;
import com.vti.crm.dto.response.UserResponse;
import com.vti.crm.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    //@Mapping(target = "role",ignore = true)
    User toUser(UserCreationRequest request);

    //@Mapping(source = "LastName", target = "lastname") hoac @Mapping( target = "lastname", ignore = true)
    //@Mapping(source = "role.id",target = "role_id", ignore = true)
    UserResponse toUserResponse(User user);

    //@Mapping(target = "role",ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}
