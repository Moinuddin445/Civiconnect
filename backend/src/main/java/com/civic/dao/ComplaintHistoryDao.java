package com.civic.dao;

import com.civic.pojos.ComplaintHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintHistoryDao extends JpaRepository<ComplaintHistory, Long> {
    List<ComplaintHistory> findByComplaintIdOrderByTimestampDesc(Long complaintId);
}
