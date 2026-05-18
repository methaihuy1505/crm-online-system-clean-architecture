package com.vti.crm.service;

import com.vti.crm.dto.request.UserCreationRequest;
import com.vti.crm.dto.request.UserUpdateRequest;
import com.vti.crm.dto.response.UserResponse;
import com.vti.crm.entity.User;
import com.vti.crm.exception.AppException;
import com.vti.crm.exception.ErrorCode;
import com.vti.crm.mapper.UserMapper;
import com.vti.crm.repository.RoleRepository;
import com.vti.crm.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    RoleRepository roleRepository;

    public User createRequest(UserCreationRequest request) {
        log.info("add here");
        if(userRepository.existsByUsername(request.getUsername()))
            throw new AppException(ErrorCode.USER_EXISTS);
//        Roles role = roleRepository.findById(Integer.parseInt(request.getRole_id()))
//                .orElseThrow(() -> new RuntimeException("Role not found"));

        User user = userMapper.toUser(request);
//        user.setRole(role);
        return userRepository.save(user);
    }
    public UserResponse updateUser (int userId, UserUpdateRequest Request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userMapper.updateUser(user, Request);
        return userMapper.toUserResponse(userRepository.save(user));
    }
    public List<UserResponse> getUsers() {
        return userRepository.findAll().stream().map(userMapper::toUserResponse).toList();
    }
    public UserResponse getUser(int userId) {
        return userMapper.toUserResponse(userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found")));
    }
    public void deleteUser(int userId) {
        userRepository.deleteById(userId);
    }
}
