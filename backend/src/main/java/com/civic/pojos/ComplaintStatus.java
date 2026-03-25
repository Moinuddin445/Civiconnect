package com.civic.pojos;

import lombok.Getter;

@Getter
public enum ComplaintStatus {
    SUBMITTED,
    ASSIGNED,
    IN_PROGRESS,
    RESOLVED,
    CLOSED
}
