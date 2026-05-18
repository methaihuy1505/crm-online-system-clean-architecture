package com.vti.crm.Controller;


import com.vti.crm.dto.request.ApiResponse;
import com.vti.crm.dto.request.UserCreationRequest;
import com.vti.crm.dto.request.UserUpdateRequest;
import com.vti.crm.dto.response.RoleResponse;
import com.vti.crm.dto.response.UserResponse;
import com.vti.crm.entity.User;
import com.vti.crm.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;

    @PostMapping
        //@RequestBody là sẽ nhận Json từ client
    ApiResponse<User> createUser(@RequestBody @Valid UserCreationRequest request) {
        ApiResponse<User> apiresponse = new ApiResponse<>();

        apiresponse.setResult(userService.createRequest(request));
        return apiresponse;
    }
    @GetMapping
    ApiResponse<List<UserResponse>> getUser() {

        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.getUsers())
                .build();
    }

    @GetMapping("/{userId}")
    UserResponse getUser(@PathVariable("userId") int userId) {
        return userService.getUser(userId);
    }

    @PutMapping("/{userId}")
    UserResponse  updateUser(@PathVariable int userId, @RequestBody UserUpdateRequest request) {
        return userService.updateUser(userId, request);
    }

    @DeleteMapping("/{userId}")
    String deleteUser(@PathVariable int userId) {
        userService.deleteUser(userId);
        return "User has been deleted";
    }
}
