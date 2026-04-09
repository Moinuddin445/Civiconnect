package com.civic.services;

import java.util.List;

import com.civic.pojos.User;
import com.civic.dto.RegisterUserDTO;

public interface AdminService {
	String createAdmin(RegisterUserDTO adminDetails);
	User getUserById(long userId); //for any user
	//also need to add a getProfileDetails but idk if really needed 
	//coz User getProfileDetails(long id); same as CitiZen service's method
	List<User> getAllUsers();
	String updateProfile(User adminDetails);
	String updateCitizenProfile(long citizenId, User citizenDetails);
	String deleteProfile(long adminId);
	String deleteCitizenProfile(long citizenId); 
}
