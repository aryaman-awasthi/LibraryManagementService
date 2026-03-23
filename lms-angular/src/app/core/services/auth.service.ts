import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Staff, LoginRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly BASE = environment.apiBaseUrl;
  private _staff = signal<Staff | null>(this.loadStaff());

  readonly staff = this._staff.asReadonly();
  readonly isLoggedIn = computed(() => this._staff() !== null);
  readonly isAdmin = computed(() => this._staff()?.role === 'ADMIN');
  readonly isLibrarian = computed(() => this._staff()?.role === 'LIBRARIAN');
  readonly isManager = computed(() => this._staff()?.role === 'MANAGER');

  constructor(private http: HttpClient, private router: Router) {}

  login(payload: LoginRequest): Observable<ApiResponse<Staff>> {
    return this.http
      .post<ApiResponse<Staff>>(`${this.BASE}/api/admin/login`, payload)
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            this._staff.set(res.data);
            sessionStorage.setItem('lms_staff', JSON.stringify(res.data));
          }
        })
      );
  }

  logout(): void {
    this._staff.set(null);
    sessionStorage.removeItem('lms_staff');
    this.router.navigate(['/login']);
  }

  private loadStaff(): Staff | null {
    try {
      const raw = sessionStorage.getItem('lms_staff');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
