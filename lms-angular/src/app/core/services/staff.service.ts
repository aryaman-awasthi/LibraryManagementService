import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Staff, CreateStaffRequest, UpdateStaffRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class StaffService {
  private readonly BASE = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getAllStaff(): Observable<ApiResponse<Staff[]>> {
    return this.http.get<ApiResponse<Staff[]>>(`${this.BASE}/api/admin/getStaff`);
  }

  getStaffById(id: number): Observable<ApiResponse<Staff>> {
    return this.http.get<ApiResponse<Staff>>(`${this.BASE}/api/admin/getStaff/${id}`);
  }

  createStaff(payload: CreateStaffRequest): Observable<ApiResponse<Staff>> {
    return this.http.post<ApiResponse<Staff>>(`${this.BASE}/api/admin/create`, payload);
  }

  updateStaffStatus(id: number, payload: UpdateStaffRequest): Observable<ApiResponse<Staff>> {
    return this.http.put<ApiResponse<Staff>>(`${this.BASE}/api/admin/update/${id}`, payload);
  }

  deleteStaff(id: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.BASE}/api/admin/delete/${id}`);
  }
}
