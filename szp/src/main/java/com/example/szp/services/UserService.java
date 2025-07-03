package com.example.szp.services;

import com.example.szp.DTO.RegisterData;
import com.example.szp.DTO.UserDataDetails;
import com.example.szp.DTO.UserDataShort;
import com.example.szp.DTO.UserPasswordChange;
import com.example.szp.models.UserAccount;
import com.example.szp.models.UserPersonalInfo;
import com.example.szp.models.UserRole;
import com.example.szp.repos.UserAccountRepo;
import com.example.szp.repos.UserPersonalInfoRepo;
import com.example.szp.utils.Mapper;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserAccountRepo userAccountRepo;
    private final UserPersonalInfoRepo userPersonalInfoRepo;

    public UserService(UserAccountRepo userAccountRepo, UserPersonalInfoRepo userPersonalInfoRepo) {
        this.userAccountRepo = userAccountRepo;
        this.userPersonalInfoRepo = userPersonalInfoRepo;
    }

    public List<UserDataShort> getAllUsers(){
        List<UserAccount> accounts = userAccountRepo.findAll();
        List<UserDataShort> userData = new ArrayList<UserDataShort>();
        userData = accounts.stream().map(Mapper::mapUserDataShort).collect(Collectors.toList());
        return userData;
    }

    public UserDataDetails getUserDataById(Long id) {
        UserAccount user = userAccountRepo.findById(id).isPresent() ? userAccountRepo.findById(id).get() : null;
        return user == null ? null : Mapper.mapUserDataDetails(user);
    }

    public UserDataShort getUserDataByUsername(String username) {
        UserAccount user = userAccountRepo.findByUserName(username);
        return user == null ? null : Mapper.mapUserDataShort(user);
    }

    public UserDataDetails getUserDataDetailsByUsername(String username) {
        UserAccount user = userAccountRepo.findByUserName(username);
        return user == null ? null : Mapper.mapUserDataDetails(user);
    }

    public void registerNewUser(RegisterData userData, PasswordEncoder encoder){
        UserAccount user = new UserAccount();
        user.setUserName(userData.getUsername());
        user.setPassword(encoder.encode(userData.getPassword()));
        user.setRole(userData.getRole());
        UserPersonalInfo personalInfo = new UserPersonalInfo();
        personalInfo.setFirstName(userData.getFirstName());
        personalInfo.setLastName(userData.getLastName());
        personalInfo.setEmail(userData.getEmail());
        personalInfo.setPhone(userData.getPhone());
        user.setPersonalInfo(personalInfo);
        userPersonalInfoRepo.save(personalInfo);
        userAccountRepo.save(user);

    }

    @Transactional
    public boolean changeUserData(UserDataDetails newUserInfo){
        UserAccount user = userAccountRepo.findById(newUserInfo.getId()).orElse(null);
        if(user == null ){
            return false;
        }
        UserPersonalInfo personalInfo = user.getPersonalInfo();
        if(personalInfo == null){
            personalInfo = new UserPersonalInfo();
        }
        System.out.println(user);
        System.out.println(newUserInfo);
        user.setUserName(newUserInfo.getUserName());
        personalInfo.setFirstName(newUserInfo.getFirstName());
        personalInfo.setLastName(newUserInfo.getLastName());
        personalInfo.setEmail(newUserInfo.getEmail());
        personalInfo.setPhone(newUserInfo.getPhone());
        userPersonalInfoRepo.save(personalInfo);
        user.setPersonalInfo(personalInfo);
        userAccountRepo.save(user);
        return true;
    }

    @Transactional
    public boolean changePassword(UserPasswordChange newUserInfo, PasswordEncoder encoder){
        UserAccount user = userAccountRepo.findById(newUserInfo.getUserId()).orElse(null);
        if(user != null){
            return false;
        }
        user.setPassword(encoder.encode(newUserInfo.getNewPassword()));
        userAccountRepo.save(user);
        return true;
    }
}
