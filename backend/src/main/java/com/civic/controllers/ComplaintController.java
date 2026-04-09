package com.civic.controllers;

import com.civic.dto.ApiResponse;
import com.civic.pojos.ComplaintCategory;
import com.civic.pojos.ComplaintStatus;
import com.civic.services.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "http://localhost:5173")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    // CITIZEN: Submit a complaint
    @PostMapping("/submit")
    public ResponseEntity<?> submitComplaint(
            @RequestParam("citizenId") Long citizenId,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("category") ComplaintCategory category,
            @RequestParam(value = "latitude", required = false) Double latitude,
            @RequestParam(value = "longitude", required = false) Double longitude,
            @RequestParam(value = "deviceLatitude", required = false) Double deviceLatitude,
            @RequestParam(value = "deviceLongitude", required = false) Double deviceLongitude,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            ApiResponse response = complaintService.submitComplaint(citizenId, title, description, category, latitude, longitude, deviceLatitude, deviceLongitude, image);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse("Error submitting complaint: " + e.getMessage()));
        }
    }

    // ALL: Get list with optional filters
    @GetMapping
    public ResponseEntity<?> getAllComplaints(
            @RequestParam(value = "status", required = false) ComplaintStatus status,
            @RequestParam(value = "category", required = false) ComplaintCategory category) {
        return ResponseEntity.ok(complaintService.getAllComplaints(status, category));
    }

    // ALL: Get complaint by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getComplaintById(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.getComplaintById(id));
    }

    // CITIZEN: Get their complaints
    @GetMapping("/citizen/{citizenId}")
    public ResponseEntity<?> getComplaintsByCitizen(@PathVariable Long citizenId) {
        return ResponseEntity.ok(complaintService.getComplaintsByCitizen(citizenId));
    }

    // OFFICER: Get assigned complaints
    @GetMapping("/officer/{officerId}")
    public ResponseEntity<?> getComplaintsByOfficer(@PathVariable Long officerId) {
        return ResponseEntity.ok(complaintService.getComplaintsByOfficer(officerId));
    }

    // ADMIN: Assign officer
    @PutMapping("/{complaintId}/assign/{officerId}")
    public ResponseEntity<?> assignOfficer(@PathVariable Long complaintId, @PathVariable Long officerId) {
        return ResponseEntity.ok(complaintService.assignOfficer(complaintId, officerId));
    }

    // OFFICER/ADMIN: Update status
    @PutMapping("/{complaintId}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long complaintId,
            @RequestParam("status") ComplaintStatus status,
            @RequestParam("remarks") String remarks,
            @RequestParam("updatedById") Long updatedById) {
        return ResponseEntity.ok(complaintService.updateComplaintStatus(complaintId, status, remarks, updatedById));
    }

    // ALL: Get history
    @GetMapping("/{id}/history")
    public ResponseEntity<?> getComplaintHistory(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.getComplaintHistory(id));
    }

    // ADMIN: Analytics Data
    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics() {
        return ResponseEntity.ok(java.util.Map.of(
            "totalComplaints", complaintService.getTotalComplaints(),
            "resolvedComplaints", complaintService.getComplaintsCountByStatus(ComplaintStatus.RESOLVED),
            "pendingComplaints", complaintService.getComplaintsCountByStatus(ComplaintStatus.SUBMITTED) + complaintService.getComplaintsCountByStatus(ComplaintStatus.ASSIGNED)
        ));
    }
}
