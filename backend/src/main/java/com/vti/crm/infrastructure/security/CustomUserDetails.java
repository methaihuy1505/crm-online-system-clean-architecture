package com.vti.crm.infrastructure.security;

import com.vti.crm.domain.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class CustomUserDetails implements UserDetails {
    private final Integer id;
    private final String username;
    private final String password;
    private final Integer roleId;

    // Khai báo biến chứa quyền
    private final Collection<? extends GrantedAuthority> authorities;

    // Sửa constructor để nhận thêm permissions
    public CustomUserDetails(User user, List<String> permissions) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.password = user.getPassword();
        this.roleId = user.getRoleId();

        // Convert List<String> thành List<SimpleGrantedAuthority>
        this.authorities = permissions.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    public Integer getRoleId() { return roleId; }
    public Integer getId() { return id; }

    @Override
    public String getUsername() { return username; }
    @Override
    public String getPassword() { return password; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities; // <--- TRẢ VỀ DANH SÁCH QUYỀN CHO SPRING SECURITY
    }

    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }
}