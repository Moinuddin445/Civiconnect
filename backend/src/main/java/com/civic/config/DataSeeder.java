package com.civic.config;

import com.civic.dao.ComplaintDao;
import com.civic.dao.ComplaintHistoryDao;
import com.civic.dao.UserDao;
import com.civic.pojos.Complaint;
import com.civic.pojos.ComplaintCategory;
import com.civic.pojos.ComplaintHistory;
import com.civic.pojos.ComplaintStatus;
import com.civic.pojos.User;
import com.civic.pojos.UserRoles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataSeeder {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    @Transactional
    CommandLineRunner initDatabase(UserDao userDao, ComplaintDao complaintDao, ComplaintHistoryDao historyDao) {
        return args -> {
            // Check if test data already exists to prevent duplicate seeding
            // We do NOT drop or replace any of your previous data.
            boolean hasTestData = userDao.findAll().stream()
                    .anyMatch(u -> "admin@civic.com".equals(u.getEmail()));
                    
            if (hasTestData) {
                System.out.println("Sample test data is already present. Skipping test data injection to preserve your existing data.");
                return;
            }

            System.out.println("Injecting sample test data ALONGSIDE your existing data...");

            // 1. Seed Roles & Users
            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@civic.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(UserRoles.ROLE_ADMIN);
            
            User superAdmin = new User();
            superAdmin.setName("Khaja (Admin)");
            superAdmin.setEmail("khaja@gmail.com");
            superAdmin.setPassword(passwordEncoder.encode("password"));
            superAdmin.setRole(UserRoles.ROLE_ADMIN);
            
            User officer1 = new User();
            officer1.setName("John Doe (Officer)");
            officer1.setEmail("john.officer@civic.com");
            officer1.setPassword(passwordEncoder.encode("officer123"));
            officer1.setRole(UserRoles.ROLE_OFFICER);

            User officer2 = new User();
            officer2.setName("Jane Smith (Officer)");
            officer2.setEmail("jane.officer@civic.com");
            officer2.setPassword(passwordEncoder.encode("officer123"));
            officer2.setRole(UserRoles.ROLE_OFFICER);

            User citizen1 = new User();
            citizen1.setName("Alice (Citizen)");
            citizen1.setEmail("alice@gmail.com");
            citizen1.setPassword(passwordEncoder.encode("citizen123"));
            citizen1.setRole(UserRoles.ROLE_CITIZEN);

            User citizen2 = new User();
            citizen2.setName("Bob (Citizen)");
            citizen2.setEmail("bob@gmail.com");
            citizen2.setPassword(passwordEncoder.encode("citizen123"));
            citizen2.setRole(UserRoles.ROLE_CITIZEN);

            userDao.saveAll(Arrays.asList(admin, superAdmin, officer1, officer2, citizen1, citizen2));

            // 2. Seed Complaints
            Complaint c1 = new Complaint();
            c1.setTitle("Massive Pothole on 5th Ave");
            c1.setDescription("There is a massive pothole that is damaging cars passing by. Needs immediate attention.");
            c1.setCategory(ComplaintCategory.ROADS);
            c1.setStatus(ComplaintStatus.SUBMITTED);
            c1.setLatitude(28.6139);
            c1.setLongitude(77.2090);
            c1.setDeviceLatitude(28.6139);
            c1.setDeviceLongitude(77.2090);
            c1.setGeoVerified(true);
            c1.setVerificationNote("Fully verified \u2014 Device GPS, map pin, and photo GPS all match.");
            c1.setCitizen(citizen1);

            Complaint c2 = new Complaint();
            c2.setTitle("Water Pipe Burst in Downtown");
            c2.setDescription("A main water pipe has burst near the intersection, causing flooding.");
            c2.setCategory(ComplaintCategory.WATER);
            c2.setStatus(ComplaintStatus.ASSIGNED);
            c2.setLatitude(28.6200);
            c2.setLongitude(77.2100);
            c2.setDeviceLatitude(28.6200);
            c2.setDeviceLongitude(77.2100);
            c2.setGeoVerified(true);
            c2.setVerificationNote("Fully verified \u2014 Device GPS, map pin, and photo GPS all match.");
            c2.setCitizen(citizen2);
            c2.setAssignedOfficer(officer1);

            Complaint c3 = new Complaint();
            c3.setTitle("Streetlights not working");
            c3.setDescription("Entire block is completely dark at night.");
            c3.setCategory(ComplaintCategory.ELECTRICITY);
            c3.setStatus(ComplaintStatus.RESOLVED);
            c3.setLatitude(28.6300);
            c3.setLongitude(77.2200);
            c3.setDeviceLatitude(28.6500); 
            c3.setDeviceLongitude(77.2500);
            c3.setGeoVerified(false);
            c3.setVerificationNote("Map pin is 3500m from your device location (max 500m allowed).");
            c3.setCitizen(citizen1);
            c3.setAssignedOfficer(officer2);

            complaintDao.saveAll(Arrays.asList(c1, c2, c3));

            // 3. Seed Complaint History
            ComplaintHistory h1 = new ComplaintHistory();
            h1.setComplaint(c1);
            h1.setStatus(ComplaintStatus.SUBMITTED);
            h1.setRemarks("Complaint submitted by citizen.");
            h1.setUpdatedBy(citizen1);

            ComplaintHistory h2a = new ComplaintHistory();
            h2a.setComplaint(c2);
            h2a.setStatus(ComplaintStatus.SUBMITTED);
            h2a.setRemarks("Complaint submitted by citizen.");
            h2a.setUpdatedBy(citizen2);

            ComplaintHistory h2b = new ComplaintHistory();
            h2b.setComplaint(c2);
            h2b.setStatus(ComplaintStatus.ASSIGNED);
            h2b.setRemarks("Assigned to John Doe.");
            h2b.setUpdatedBy(admin);

            ComplaintHistory h3a = new ComplaintHistory();
            h3a.setComplaint(c3);
            h3a.setStatus(ComplaintStatus.SUBMITTED);
            h3a.setRemarks("Complaint submitted by citizen.");
            h3a.setUpdatedBy(citizen1);

            ComplaintHistory h3b = new ComplaintHistory();
            h3b.setComplaint(c3);
            h3b.setStatus(ComplaintStatus.RESOLVED);
            h3b.setRemarks("Electricians dispatched. Lights fixed.");
            h3b.setUpdatedBy(officer2);

            historyDao.saveAll(Arrays.asList(h1, h2a, h2b, h3a, h3b));

            System.out.println("Sample Data Seeding Complete!");
        };
    }
}
