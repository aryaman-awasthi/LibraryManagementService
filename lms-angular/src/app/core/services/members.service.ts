import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Member, CreateMemberRequest, IssueRecord, IssueRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class MembersService {
  private readonly BASE = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // ── Members ────────────────────────────────────────────
  getAllMembers(): Observable<ApiResponse<Member[]>> {
    return this.http.get<ApiResponse<Member[]>>(`${this.BASE}/lib/member/getAll`);
  }

  getMemberById(id: number): Observable<ApiResponse<Member>> {
    return this.http.get<ApiResponse<Member>>(`${this.BASE}/lib/member/${id}`);
  }

  createMember(payload: CreateMemberRequest): Observable<ApiResponse<Member>> {
    return this.http.post<ApiResponse<Member>>(`${this.BASE}/lib/member/create`, payload);
  }

  deleteMember(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.BASE}/lib/member/delete/${id}`);
  }

  // ── Issue / Return ─────────────────────────────────────
  issueBook(payload: IssueRequest): Observable<ApiResponse<IssueRecord>> {
    return this.http.post<ApiResponse<IssueRecord>>(`${this.BASE}/lib/issue`, payload);
  }

  returnBook(bookCopyId: number): Observable<ApiResponse<IssueRecord>> {
    return this.http.post<ApiResponse<IssueRecord>>(`${this.BASE}/lib/return/${bookCopyId}`, {});
  }

  calculateFine(bookCopyId: number): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.BASE}/lib/calculateFine/${bookCopyId}`);
  }
}
