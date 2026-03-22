package com.tcs.lms_backend.repository;

import com.tcs.lms_backend.dto.response.StaffResponse;
import com.tcs.lms_backend.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AdminRepository extends JpaRepository<Staff, Integer> {

    // @Query(value = "SELECT * FROM question q WHERE q.category=:category ORDER BY RANDOM() LIMIT :questions", nativeQuery = true)
    //    List<Question> getRandomQuestionByCategory(String category, int questions);

    @Query(value = "SELECT staff_id, name, role, is_active FROM staff", nativeQuery = true)
    List<StaffResponse> getStaffMembers();

    @Query(value = "SELECT staff_id, name, role, is_active FROM staff s where s.staff_id =:id ", nativeQuery = true)
    StaffResponse getStaffMember(int id);

}
