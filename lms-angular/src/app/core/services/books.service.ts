import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Book, AddBookRequest, BookCopy, CreateBookCopyRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class BooksService {
  private readonly BASE = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // ── Books ──────────────────────────────────────────────
  getAllBooks(): Observable<ApiResponse<Book[]>> {
    return this.http.get<ApiResponse<Book[]>>(`${this.BASE}/api/books/getBooks`);
  }

  getBookById(id: number): Observable<ApiResponse<Book>> {
    return this.http.get<ApiResponse<Book>>(`${this.BASE}/api/books/getBook/${id}`);
  }

  addBook(payload: AddBookRequest): Observable<ApiResponse<Book>> {
    return this.http.post<ApiResponse<Book>>(`${this.BASE}/api/books/add`, payload);
  }

  deleteBook(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.BASE}/api/books/delete/${id}`);
  }

  searchBooks(query: string): Observable<ApiResponse<Book[]>> {
    return this.http.get<ApiResponse<Book[]>>(`${this.BASE}/api/books/getBooks?search=${query}`);
  }

  // ── Book Copies ────────────────────────────────────────
  getBookCopies(bookId: number): Observable<ApiResponse<BookCopy[]>> {
    return this.http.get<ApiResponse<BookCopy[]>>(`${this.BASE}/api/books/get/book_copies/${bookId}`);
  }

  getBookCopyCount(bookId: number): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.BASE}/api/books/book_copies/count/${bookId}`);
  }

  createBookCopy(bookId: number, payload: CreateBookCopyRequest = {}): Observable<ApiResponse<BookCopy>> {
    return this.http.post<ApiResponse<BookCopy>>(
      `${this.BASE}/api/books/create/book_copy/${bookId}`,
      payload
    );
  }
}
