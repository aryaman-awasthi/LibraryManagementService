package com.tcs.lms_backend.service;

import com.tcs.lms_backend.dto.response.BookCopyCreateResponse;
import com.tcs.lms_backend.dto.response.BookCopyResponse;
import com.tcs.lms_backend.dto.response.IssueResponse;
import com.tcs.lms_backend.enums.BookStatus;
import com.tcs.lms_backend.enums.TransactionStatus;
import com.tcs.lms_backend.model.Book;
import com.tcs.lms_backend.model.BookCopy;
import com.tcs.lms_backend.model.IssueTransaction;
import com.tcs.lms_backend.model.Member;
import com.tcs.lms_backend.repository.BookCopyRepository;
import com.tcs.lms_backend.repository.BookRepository;
import com.tcs.lms_backend.repository.IssueTransactionRepository;
import com.tcs.lms_backend.repository.MemberRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookCopyService {
    @Autowired
    BookCopyRepository bookCopyRepository;

    @Autowired
    BookRepository bookRepository;

    @Autowired
    BookService bookService;

    @Autowired
    MemberRepository memberRepository;

    @Autowired
    IssueTransactionRepository issueTransactionRepository;

    @Transactional
    public BookCopyCreateResponse addCopy(int bookId, BookCopy bookCopy) {

        Book book = bookService.getBook(bookId);

        bookCopy.setBook(book);

        if (bookCopy.getStatus() == null) {
            bookCopy.setStatus(BookStatus.AVAILABLE);
        }

        return bookCopyCreateMapper(bookCopyRepository.save(bookCopy));
    }

    public List<BookCopyResponse> getBookCopies(int bookId) {
        List<BookCopyResponse> bookCopyResponses = new ArrayList<>();
        List<BookCopy> bookCopies = bookCopyRepository.findByBookBookID(bookId);

        for (BookCopy bookCopy : bookCopies) {
            bookCopyResponses.add(bookCopyMapper(bookCopy));
        }
        return bookCopyResponses;
    }

    public Long getBookCopyCount(int id) {
        return bookCopyRepository.countByBookBookID(id);
    }

    @Transactional
    public IssueResponse issueBook(int memberId, int bookCopyId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        BookCopy bookCopy = bookCopyRepository.findById(bookCopyId)
                .orElseThrow(() -> new RuntimeException("Book copy not found"));
        if (bookCopy.getIssued()) {
            throw new RuntimeException("Book already issued");
        }
        bookCopy.setIssued(true);
        bookCopy.setIssuedTo(member);
        bookCopy.setIssuedAt(LocalDateTime.now());

        IssueTransaction txn = new IssueTransaction();
        txn.setBookCopy(bookCopy);
        txn.setMember(member);
        txn.setStatus(TransactionStatus.issued);

        return mapToResponse(issueTransactionRepository.save(txn));
    }

    public IssueResponse mapToResponse(IssueTransaction txn) {
        IssueResponse res = new IssueResponse();

        res.setIssueId(txn.getIssueID());
        res.setBookCopyId(txn.getBookCopy().getBookCopyID());
        res.setBookId(txn.getBookCopy().getBook().getBookID());
        res.setBookName(txn.getBookCopy().getBook().getBookName());
        res.setMemberId(txn.getMember().getMemberID());
        res.setMemberName(txn.getMember().getName());
        res.setIssuedAt(txn.getIssuedAt());
        res.setStatus(txn.getStatus().name());

        return res;
    }

    public BookCopyResponse bookCopyMapper(BookCopy copy) {
        BookCopyResponse res = new BookCopyResponse();

        res.setBookCopyId(copy.getBookCopyID());
        res.setBookId(copy.getBook().getBookID());
        res.setBookName(copy.getBook().getBookName());
        res.setStatus(copy.getStatus().name());
        res.setIssued(copy.getIssued());
        res.setIssuedAt(copy.getIssuedAt());

        if (copy.getIssuedTo() != null) {
            res.setMemberId(copy.getIssuedTo().getMemberID());
            res.setMemberName(copy.getIssuedTo().getName());
        }

        return res;
    }
    public BookCopyCreateResponse bookCopyCreateMapper(BookCopy copy) {
        BookCopyCreateResponse res = new BookCopyCreateResponse();

        res.setBookCopyId(copy.getBookCopyID());
        res.setBookId(copy.getBook().getBookID());
        res.setBookName(copy.getBook().getBookName());
        res.setStatus(copy.getStatus().name());
        res.setIssued(copy.getIssued());
        res.setCreatedAt(copy.getCreatedAt());

        return res;
    }
}


