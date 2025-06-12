package com.example.szp.init;

import com.example.szp.models.UserAccount;
import com.example.szp.models.UserPersonalInfo;
import com.example.szp.models.UserRole;
import com.example.szp.repos.UserAccountRepo;
import com.example.szp.repos.UserPersonalInfoRepo;
import com.example.szp.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
public class DataLoader {
    @Bean
    public CommandLineRunner initUsers(
            UserAccountRepo userRepo, UserPersonalInfoRepo infoRepo,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            JwtUtils jwtUtils) {
        return args -> {
            UserAccount newUserAccount = new UserAccount();
            newUserAccount.setUserName("testAdmin");
            newUserAccount.setPassword(passwordEncoder.encode("password"));
            newUserAccount.setRole(UserRole.ADMIN);

            userRepo.save(newUserAccount);

            UserAccount newUserAccount2 = new UserAccount();
            newUserAccount2.setUserName("testUser");
            newUserAccount2.setPassword(passwordEncoder.encode("password"));
            newUserAccount2.setRole(UserRole.NORMAL_USER);

            userRepo.save(newUserAccount2);

            UserAccount admin = new UserAccount(null, "adminUser", UserRole.ADMIN, null, "admin123", true, Set.of(), Set.of(), Set.of());
            UserAccount user = new UserAccount(null, "normalUser", UserRole.NORMAL_USER, null, "user123", true, Set.of(), Set.of(), Set.of());
            UserAccount editor = new UserAccount(null, "editorUser", UserRole.EDITOR, null, "editor123", true, Set.of(), Set.of(), Set.of());

            // Save users first to generate IDs
            userRepo.save(admin);
            userRepo.save(user);
            userRepo.save(editor);

            UserPersonalInfo adminInfo = new UserPersonalInfo(null, admin, "Anna", "Admin", "admin@example.com", "111-222-333");
            UserPersonalInfo userInfo = new UserPersonalInfo(null, user, "Ula", "User", "user@example.com", "222-333-444");
            UserPersonalInfo editorInfo = new UserPersonalInfo(null, editor, "Edward", "Editor", "editor@example.com", "333-444-555");

            infoRepo.save(adminInfo);
            infoRepo.save(userInfo);
            infoRepo.save(editorInfo);

            // Update user accounts to link personalInfo (optional step if needed bidirectionally)
            admin.setPersonalInfo(adminInfo);
            user.setPersonalInfo(userInfo);
            editor.setPersonalInfo(editorInfo);

            userRepo.save(admin);
            userRepo.save(user);
            userRepo.save(editor);
        };
    }
}
