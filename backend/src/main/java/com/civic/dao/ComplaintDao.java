package com.civic.dao;

import com.civic.pojos.Complaint;
import com.civic.pojos.ComplaintCategory;
import com.civic.pojos.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintDao extends JpaRepository<Complaint, Long> {
    List<Complaint> findByCitizenId(Long citizenId);
    List<Complaint> findByAssignedOfficerId(Long officerId);
    List<Complaint> findByStatus(ComplaintStatus status);
    List<Complaint> findByCategory(ComplaintCategory category);
    boolean existsByCitizenIdAndCategoryAndLatitudeAndLongitudeAndStatusNot(
            Long citizenId, ComplaintCategory category, Double latitude, Double longitude, ComplaintStatus status);
}
