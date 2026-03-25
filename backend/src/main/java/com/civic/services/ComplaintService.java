package com.civic.services;

import com.civic.dto.ApiResponse;
import com.civic.dto.ComplaintHistoryRespDTO;
import com.civic.dto.ComplaintRespDTO;
import com.civic.pojos.ComplaintCategory;
import com.civic.pojos.ComplaintStatus;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ComplaintService {
    
    // Citizen methods
    ApiResponse submitComplaint(Long citizenId, String title, String description, ComplaintCategory category, Double lat, Double lng, MultipartFile image) throws IOException;
    List<ComplaintRespDTO> getComplaintsByCitizen(Long citizenId);
    
    // Officer methods
    List<ComplaintRespDTO> getComplaintsByOfficer(Long officerId);
    ApiResponse updateComplaintStatus(Long complaintId, ComplaintStatus newStatus, String remarks, Long adminOrOfficerId);
    
    // Admin methods
    List<ComplaintRespDTO> getAllComplaints(ComplaintStatus status, ComplaintCategory category);
    ApiResponse assignOfficer(Long complaintId, Long officerId);
    
    // General
    List<ComplaintHistoryRespDTO> getComplaintHistory(Long complaintId);
    ComplaintRespDTO getComplaintById(Long complaintId);
    
    // Analytics
    long getTotalComplaints();
    long getComplaintsCountByStatus(ComplaintStatus status);
}
