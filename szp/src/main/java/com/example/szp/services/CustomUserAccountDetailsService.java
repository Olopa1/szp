package com.example.szp.services;

import com.example.szp.models.UserAccount;
import com.example.szp.repos.UserAccountRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserAccountDetailsService implements UserDetailsService {
    @Autowired
    private UserAccountRepo userAccountRepo;
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserAccount userAccount = userAccountRepo.findByUserName(username);
        if (userAccount == null) {
            throw new UsernameNotFoundException(username);
        }
        return new org.springframework.security.core.userdetails.User(
            userAccount.getUserName(),
                userAccount.getPassword(),
                Collections.emptyList()
        );
    }
}
