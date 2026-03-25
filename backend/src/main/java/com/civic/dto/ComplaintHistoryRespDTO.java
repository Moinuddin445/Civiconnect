package com.civic.dto;

import com.civic.pojos.ComplaintStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ComplaintHistoryRespDTO {
    private Long id;
    private Long complaintId;
    private ComplaintStatus status;
    private String remarks;
    private String updatedByName;
    private String updatedByRole;
    private LocalDateTime timestamp;
}
