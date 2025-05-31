package com.example.szp.DTO;

import com.example.szp.models.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDataDetails {
    Long id;
    String firstName;
    String lastName;
    String userName;
    String email;
    String phone;
    UserRole userRole;
}
