package com.example.szp.controllers;

import com.example.szp.models.UserAccount;
import com.example.szp.repos.UserAccountRepo;
import com.example.szp.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    JwtUtils jwtUtils;
    @Autowired
    UserAccountRepo userAccountRepo;
    @PostMapping("/signin")
    public String authenticateUser(@RequestBody UserAccount userAccount) {
        System.out.println(userAccount);
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userAccount.getUserName(),
                        userAccount.getPassword()
                )
        );
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return jwtUtils.generateToken(userDetails.getUsername());
    }
    @PostMapping("/signup")
    public String registerUser(@RequestBody UserAccount userAccount) {
        if(userAccountRepo.existsByUserName(userAccount.getUserName())) {
            return "Error: Username already exists";
        }
        UserAccount newUserAccount = new UserAccount();
        newUserAccount.setUserName(userAccount.getUserName());
        newUserAccount.setPassword(passwordEncoder.encode(userAccount.getPassword()));
        userAccountRepo.save(newUserAccount);
        return "User registered successfully";
    }
}
