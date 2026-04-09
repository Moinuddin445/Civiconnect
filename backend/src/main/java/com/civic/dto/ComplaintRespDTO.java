package com.civic.dto;

import com.civic.pojos.ComplaintCategory;
import com.civic.pojos.ComplaintStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ComplaintRespDTO {
    private Long id;
    private String title;
    private String description;
    private ComplaintCategory category;
    private ComplaintStatus status;
    private Double latitude;
    private Double longitude;
    private String imageUrl;
    
    // Geo-verification
    private Boolean geoVerified;
    private String verificationNote;
    
    // Flattened user info
    private Long citizenId;
    private String citizenName;
    private Long assignedOfficerId;
    private String assignedOfficerName;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
