package com.vti.crm.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String username;
    String full_name;
    String email;
    String phone;
    //int role_id;
    int branch_id;
    int team_id;
}
