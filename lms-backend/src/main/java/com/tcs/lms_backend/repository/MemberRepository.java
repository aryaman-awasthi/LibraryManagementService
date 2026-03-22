package com.tcs.lms_backend.repository;

import com.tcs.lms_backend.dto.response.MemberWrapper;
import com.tcs.lms_backend.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MemberRepository extends JpaRepository<Member, Integer> {

    @Query(value = "SELECT memberid, name, created_at from member", nativeQuery = true)
    List<MemberWrapper> getMemberWrapper();
}
