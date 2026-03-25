package com.civic.services;

import com.civic.custom_exceptions.ResourceNotFoundException;
import com.civic.dao.ComplaintDao;
import com.civic.dao.ComplaintHistoryDao;
import com.civic.dao.UserDao;
import com.civic.dto.ApiResponse;
import com.civic.dto.ComplaintHistoryRespDTO;
import com.civic.dto.ComplaintRespDTO;
import com.civic.pojos.Complaint;
import com.civic.pojos.ComplaintCategory;
import com.civic.pojos.ComplaintHistory;
import com.civic.pojos.ComplaintStatus;
import com.civic.pojos.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ComplaintServiceImple implements ComplaintService {

    @Autowired
    private ComplaintDao complaintDao;

    @Autowired
    private ComplaintHistoryDao historyDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private ImageHandlingService imageService;

    // TODO: @Autowired private EmailService emailService; (Or JavaMailSender logic)

    @Override
    public ApiResponse submitComplaint(Long citizenId, String title, String description, ComplaintCategory category, Double lat, Double lng, MultipartFile image) throws IOException {
        User citizen = userDao.findById(citizenId)
                .orElseThrow(() -> new ResourceNotFoundException("Citizen not found"));

        // Optional duplicate detection
        boolean isDuplicate = complaintDao.existsByCitizenIdAndCategoryAndLatitudeAndLongitudeAndStatusNot(
                citizenId, category, lat, lng, ComplaintStatus.CLOSED);
        
        if(isDuplicate) {
            return new ApiResponse("A similar active complaint already exists at this location.");
        }

        Complaint complaint = new Complaint();
        complaint.setTitle(title);
        complaint.setDescription(description);
        complaint.setCategory(category);
        complaint.setStatus(ComplaintStatus.SUBMITTED);
        complaint.setLatitude(lat);
        complaint.setLongitude(lng);
        complaint.setCitizen(citizen);

        if (image != null && !image.isEmpty()) {
            String imageUrl = imageService.uploadImage(image);
            complaint.setImageUrl(imageUrl);
        }

        Complaint savedComplaint = complaintDao.save(complaint);
        saveHistory(savedComplaint, ComplaintStatus.SUBMITTED, "Complaint submitted", citizen);

        return new ApiResponse("Complaint submitted successfully!");
    }

    @Override
    public List<ComplaintRespDTO> getComplaintsByCitizen(Long citizenId) {
        return complaintDao.findByCitizenId(citizenId).stream()
                .map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<ComplaintRespDTO> getComplaintsByOfficer(Long officerId) {
        return complaintDao.findByAssignedOfficerId(officerId).stream()
                .map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public ApiResponse updateComplaintStatus(Long complaintId, ComplaintStatus newStatus, String remarks, Long updatedById) {
        Complaint complaint = complaintDao.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        User updater = userDao.findById(updatedById)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        complaint.setStatus(newStatus);
        saveHistory(complaint, newStatus, remarks, updater);
        
        // FUTURE: Fetch citizen email and send notification
        
        return new ApiResponse("Complaint status updated to " + newStatus.name());
    }

    @Override
    public List<ComplaintRespDTO> getAllComplaints(ComplaintStatus status, ComplaintCategory category) {
        List<Complaint> complaints;
        if (status != null && category != null) {
            // requires a custom query, for simplicity returning all and filtering, or just use one
            complaints = complaintDao.findAll().stream()
                    .filter(c -> c.getStatus() == status && c.getCategory() == category)
                    .collect(Collectors.toList());
        } else if (status != null) {
            complaints = complaintDao.findByStatus(status);
        } else if (category != null) {
            complaints = complaintDao.findByCategory(category);
        } else {
            complaints = complaintDao.findAll();
        }
        return complaints.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public ApiResponse assignOfficer(Long complaintId, Long officerId) {
        Complaint complaint = complaintDao.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        User officer = userDao.findById(officerId)
                .orElseThrow(() -> new ResourceNotFoundException("Officer not found"));

        complaint.setAssignedOfficer(officer);
        complaint.setStatus(ComplaintStatus.ASSIGNED);
        
        User admin = userDao.findById(1L).orElse(officer); // Quick fallback for history
        saveHistory(complaint, ComplaintStatus.ASSIGNED, "Assigned to officer: " + officer.getName(), admin);

        return new ApiResponse("Complaint assigned successfully to " + officer.getName());
    }

    @Override
    public List<ComplaintHistoryRespDTO> getComplaintHistory(Long complaintId) {
        return historyDao.findByComplaintIdOrderByTimestampDesc(complaintId).stream()
                .map(h -> {
                    ComplaintHistoryRespDTO dto = new ComplaintHistoryRespDTO();
                    dto.setId(h.getId());
                    dto.setComplaintId(h.getComplaint().getId());
                    dto.setStatus(h.getStatus());
                    dto.setRemarks(h.getRemarks());
                    dto.setUpdatedByName(h.getUpdatedBy().getName());
                    dto.setUpdatedByRole(h.getUpdatedBy().getRole().name());
                    dto.setTimestamp(h.getTimestamp());
                    return dto;
                }).collect(Collectors.toList());
    }

    @Override
    public ComplaintRespDTO getComplaintById(Long complaintId) {
        Complaint complaint = complaintDao.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        return mapToDTO(complaint);
    }

    @Override
    public long getTotalComplaints() {
        return complaintDao.count();
    }

    @Override
    public long getComplaintsCountByStatus(ComplaintStatus status) {
        return complaintDao.findByStatus(status).size();
    }

    private void saveHistory(Complaint complaint, ComplaintStatus status, String remarks, User updatedBy) {
        ComplaintHistory history = new ComplaintHistory();
        history.setComplaint(complaint);
        history.setStatus(status);
        history.setRemarks(remarks);
        history.setUpdatedBy(updatedBy);
        historyDao.save(history);
    }

    private ComplaintRespDTO mapToDTO(Complaint complaint) {
        ComplaintRespDTO dto = new ComplaintRespDTO();
        dto.setId(complaint.getId());
        dto.setTitle(complaint.getTitle());
        dto.setDescription(complaint.getDescription());
        dto.setCategory(complaint.getCategory());
        dto.setStatus(complaint.getStatus());
        dto.setLatitude(complaint.getLatitude());
        dto.setLongitude(complaint.getLongitude());
        dto.setImageUrl(complaint.getImageUrl());
        
        if (complaint.getCitizen() != null) {
            dto.setCitizenId(complaint.getCitizen().getId());
            dto.setCitizenName(complaint.getCitizen().getName());
        }
        
        if (complaint.getAssignedOfficer() != null) {
            dto.setAssignedOfficerId(complaint.getAssignedOfficer().getId());
            dto.setAssignedOfficerName(complaint.getAssignedOfficer().getName());
        }
        
        dto.setCreatedAt(complaint.getCreatedAt());
        dto.setUpdatedAt(complaint.getUpdatedAt());
        return dto;
    }
}
