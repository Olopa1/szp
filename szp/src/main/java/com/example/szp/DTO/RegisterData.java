package com.example.szp.DTO;

import com.example.szp.models.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RegisterData {
    String username;
    String password;
    String firstName;
    String lastName;
    String email;
    String phone;
    UserRole role;
    boolean isUserActive;
}
