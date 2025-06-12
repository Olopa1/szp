package com.example.szp.controllers;

import com.example.szp.DTO.UserDataShort;
import com.example.szp.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/user")
public class UserController {
    @Autowired
    UserService userService;

    @GetMapping("allUsers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDataShort>> getAllUsers() {
        List<UserDataShort> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("findUserById")
    @PreAuthorize("hasAnyRole('ADMIN','NORMAL_USER')")
    public ResponseEntity<UserDataShort> findUserById(@RequestParam("id") Long id) {
        UserDataShort user = userService.getUserDataById(id);
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

    //@PutMapping("addNew")
}
