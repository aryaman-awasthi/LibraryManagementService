package com.tcs.lms_backend.controller;

import com.tcs.lms_backend.dto.request.IssueRequest;
import com.tcs.lms_backend.dto.response.ApiResponse;
import com.tcs.lms_backend.dto.response.IssueResponse;
import com.tcs.lms_backend.dto.response.MemberWrapper;
import com.tcs.lms_backend.model.IssueTransaction;
import com.tcs.lms_backend.model.Member;
import com.tcs.lms_backend.service.BookCopyService;
import com.tcs.lms_backend.service.LibrarianService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("lib")
public class LibrarianController {

    @Autowired
    LibrarianService librarianService;

    @Autowired
    BookCopyService bookCopyService;

    @PostMapping("member/create")
    public ResponseEntity<ApiResponse<Member>> createMember(@RequestBody Member member) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("created", librarianService.createMember(member)));
    }

    @GetMapping("member/getAll")
    public ResponseEntity<ApiResponse<List<MemberWrapper>>> getAllMembers() {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("fetched", librarianService.getAllMembers()));
    }

    @GetMapping("member/{id}")
    public ResponseEntity<ApiResponse<Member>> getMember(@PathVariable int id) {
        return ResponseEntity.ok(ApiResponse.success("fetched", librarianService.getMember(id)));
    }

    @DeleteMapping("member/delete/{id}")
    public ResponseEntity<ApiResponse<Boolean>> deleteMember(@PathVariable int id) {
        return ResponseEntity.ok(ApiResponse.success("deleted", librarianService.deleteMember(id)));
    }

    @PostMapping("issue")
    public ResponseEntity<ApiResponse<IssueResponse>> issue (@RequestBody IssueRequest issueRequest) {
        IssueResponse issueTransaction = bookCopyService.issueBook(issueRequest.getMemberID(), issueRequest.getBookCopyID());
        return ResponseEntity.ok(ApiResponse.success("issued", issueTransaction));
    }

    @PostMapping("return/{id}")
    public ResponseEntity<ApiResponse<IssueResponse>> bookReturn(@PathVariable int id) {
        IssueResponse issueResponse = bookCopyService.returnBook(id);
        return ResponseEntity.ok(ApiResponse.success("returned", issueResponse));
    }

    @GetMapping("calculateFine/{id}")
    public ResponseEntity<ApiResponse<Double>> getFine(@PathVariable int id) {
        double fine = bookCopyService.fine(id);
        return ResponseEntity.ok(ApiResponse.success("fine calculated", fine));
    }

}
