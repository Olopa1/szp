package com.example.szp.controllers;

import com.example.szp.DTO.UserDataDetails;
import com.example.szp.DTO.UserDataShort;
import com.example.szp.DTO.UserPasswordChange;
import com.example.szp.models.UserAccount;
import com.example.szp.security.JwtUtils;
import com.example.szp.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("api/user")
public class UserController {
    @Autowired
    UserService userService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtils jwtUtils;

    @GetMapping("allUsers")
    @PreAuthorize("hasAnyRole('ADMIN', 'NORMAL_USER')")
    public ResponseEntity<List<UserDataShort>> getAllUsers() {
        List<UserDataShort> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ADMIN','NORMAL_USER')")
    @GetMapping("findUserById/{id}")
    public ResponseEntity<UserDataDetails> findUserById(@PathVariable("id") Long id) {
        UserDataDetails user = userService.getUserDataById(id);
        if(user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("findUserByName")
    @PreAuthorize("hasAnyRole('ADMIN','NORMAL_USER')")
    public ResponseEntity<UserDataShort> getUserByName(@RequestParam("name") String username) {
        UserDataShort user = userService.getUserDataByUsername(username);
        if(user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("updateUser")
    @PreAuthorize("hasAnyRole('ADMIN', 'NORMAL_USER')")
    public ResponseEntity<?> updateUser(@RequestBody UserDataDetails updatedUser, HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Brak tokenu");
            }

            String token = authHeader.substring(7); // usuwa "Bearer "
            String usernameFromToken = jwtUtils.getUserNameFromToken(token);

            boolean shouldGenerateNewToken = !usernameFromToken.equals(updatedUser.getUserName());

            boolean result = userService.changeUserData(updatedUser);

            if (!result) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User does not exist");
            }

            if (shouldGenerateNewToken) {
                // pobierz pełny obiekt użytkownika po zmianie
                UserDataDetails user = userService.getUserDataById(updatedUser.getId());
                if (user == null) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User not found after update");
                }

                String newToken = jwtUtils.generateToken(user.getUserName(),user.getUserRole());
                return ResponseEntity.ok(Collections.singletonMap("token", newToken));
            }

            return ResponseEntity.ok().build();

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server error");
        }
    }
}
