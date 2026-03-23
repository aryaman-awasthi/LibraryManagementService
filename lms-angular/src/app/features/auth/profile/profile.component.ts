import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div>
        <h1>My Profile</h1>
        <p class="text-muted">Your account details</p>
      </div>
    </div>

    @if (auth.staff(); as staff) {
      <div class="profile-card card">
        <div class="avatar">{{ initials(staff.name) }}</div>
        <h2>{{ staff.name }}</h2>
        <span class="badge" [ngClass]="roleBadge(staff.role)">{{ staff.role }}</span>

        <div class="info-grid mt-4">
          <div class="info-item">
            <label>Staff ID</label>
            <span class="font-mono">{{ staff.staff_id }}</span>
          </div>
          <div class="info-item">
            <label>Role</label>
            <span>{{ staff.role }}</span>
          </div>
          <div class="info-item">
            <label>Status</label>
            <span class="badge" [ngClass]="staff.active ? 'badge-success' : 'badge-danger'">
              {{ staff.active ? 'Active' : 'Inactive' }}
            </span>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .profile-card {
      max-width: 480px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 40px;

      h2 { font-size: 20px; }
    }

    .avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: var(--accent-blue-dim);
      border: 2px solid var(--accent-blue);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      font-weight: 700;
      color: var(--accent-blue);
    }

    .info-grid {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 12px;
      border-top: 1px solid var(--border-light);
      padding-top: 20px;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      label {
        font-size: 12px;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.4px;
      }
      span { font-size: 13px; }
    }
  `]
})
export class ProfileComponent {
  auth = inject(AuthService);

  initials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  roleBadge(role: string): string {
    const map: Record<string, string> = {
      ADMIN: 'badge-danger',
      LIBRARIAN: 'badge-info',
      MANAGER: 'badge-warning',
    };
    return map[role] ?? 'badge-default';
  }
}
