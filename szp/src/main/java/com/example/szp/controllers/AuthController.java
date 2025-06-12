package com.example.szp.controllers;

import com.example.szp.DTO.LoginData;
import com.example.szp.DTO.RegisterData;
import com.example.szp.models.UserAccount;
import com.example.szp.models.UserRole;
import com.example.szp.repos.UserAccountRepo;
import com.example.szp.security.JwtUtils;
import com.example.szp.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

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
    @Autowired
    UserService userService;
    @PostMapping("/signin")
    public ResponseEntity<String> authenticateUser(@RequestBody LoginData loginDataRequest) {
        try{
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginDataRequest.getUsername(),
                            loginDataRequest.getPassword()
                    )
            );
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            UserAccount userAccount = userAccountRepo.findByUserName(userDetails.getUsername());
            return new ResponseEntity<>(jwtUtils.generateToken(userDetails.getUsername(), userAccount.getRole()), HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }
    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(@RequestBody RegisterData registerData) {
        if(userAccountRepo.existsByUserName(registerData.getUsername())) {
            return new ResponseEntity<>("Error: Username already exists", HttpStatus.CONFLICT);
        }
        userService.registerNewUser(registerData, passwordEncoder);
        System.out.println("User registered: " + registerData.getUsername());
        return new ResponseEntity<>("User registered successfully", HttpStatus.OK);
    }

    @GetMapping("/validateToken")
    public ResponseEntity<String> validateToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return new ResponseEntity<>("no token found", HttpStatus.UNAUTHORIZED);
        }

        String token = authHeader.substring(7);

        if(jwtUtils.validateToken(token)) {
            return new ResponseEntity<>("valid", HttpStatus.OK);
        }

        return new ResponseEntity<>("invalid", HttpStatus.UNAUTHORIZED);
    }
    @GetMapping("/getRoleFromToken")
    public ResponseEntity<String> getRoleFromToken(@RequestHeader("Authorization") String authHeader) {
        //System.out.println(authHeader);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return new ResponseEntity<>("no token found", HttpStatus.UNAUTHORIZED);
        }
        String token = authHeader.substring(7);
        if(!jwtUtils.validateToken(token)) {
            return new ResponseEntity<>("invalid", HttpStatus.UNAUTHORIZED);
        }
        String role = jwtUtils.getUserRoleFromToken(token);
        return new ResponseEntity<>(role, HttpStatus.OK);
    }
}
