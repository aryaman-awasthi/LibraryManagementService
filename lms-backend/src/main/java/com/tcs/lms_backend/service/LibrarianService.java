package com.tcs.lms_backend.service;

import com.tcs.lms_backend.dto.response.MemberWrapper;
import com.tcs.lms_backend.model.Member;
import com.tcs.lms_backend.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LibrarianService {

    @Autowired
    MemberRepository memberRepository;

    public Member createMember(Member member) {
        return memberRepository.save(member);
    }

    public List<MemberWrapper> getAllMembers() {
        return memberRepository.getMemberWrapper();
    }
    public Member getMember(int id) {
        Optional<Member> member = memberRepository.findById(id);
        if (member.isEmpty()) {
            throw new RuntimeException("No member with id " + id + " present");
        }
        return member.get();
    }
    public boolean deleteMember(int id) {
        memberRepository.delete(getMember(id));
        return true;
    }
}
