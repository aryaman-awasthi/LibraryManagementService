import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StaffService } from '../../../core/services/staff.service';
import { ToastService } from '../../../core/services/toast.service';
import { Staff, CreateStaffRequest, StaffRole } from '../../../core/models';

@Component({
  selector: 'app-staff-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div>
        <h1>Staff Management</h1>
        <p class="text-muted">Manage librarians, managers and admin accounts</p>
      </div>
      <button class="btn btn-primary btn-sm" (click)="showModal.set(true)">＋ Add Staff</button>
    </div>

    <div class="table-wrap">
      @if (loading()) {
        <div class="loading-overlay"><span class="spinner"></span></div>
      } @else if (staffList().length === 0) {
        <div class="empty-state">
          <div class="empty-icon">👤</div>
          <strong>No staff found</strong>
        </div>
      } @else {
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (s of staffList(); track s.staff_id) {
              <tr>
                <td class="font-mono">{{ s.staff_id }}</td>
                <td>{{ s.name }}</td>
                <td>
                  <span class="badge" [ngClass]="roleBadge(s.role)">{{ s.role }}</span>
                </td>
                <td>
                  <span class="badge" [ngClass]="s.active ? 'badge-success' : 'badge-danger'">
                    {{ s.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <div class="action-btns">
                    <button
                      class="btn btn-ghost btn-sm"
                      (click)="toggleStatus(s)"
                    >
                      {{ s.active ? 'Deactivate' : 'Activate' }}
                    </button>
                    <button
                      class="btn btn-danger btn-sm"
                      (click)="deleteStaff(s)"
                    >Delete</button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>

    <!-- Add staff modal -->
    @if (showModal()) {
      <div class="modal-overlay" (click)="onOverlay($event)">
        <div class="modal-box" role="dialog">
          <div class="modal-header">
            <h3>Add Staff Member</h3>
            <button class="modal-close" (click)="closeModal()">✕</button>
          </div>

          <div class="form-body">
            <div class="form-group">
              <label>Name *</label>
              <input type="text" [(ngModel)]="form.name" placeholder="Full name" />
            </div>
            <div class="form-group">
              <label>Role *</label>
              <select [(ngModel)]="form.role">
                <option value="LIBRARIAN">Librarian</option>
                <option value="MANAGER">Manager</option>
              </select>
            </div>
            <div class="form-group">
              <label>Password *</label>
              <input type="password" [(ngModel)]="form.password" placeholder="Set password" />
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeModal()">Cancel</button>
            <button
              class="btn btn-primary"
              (click)="createStaff()"
              [disabled]="saving() || !isFormValid()"
            >
              @if (saving()) { <span class="spinner"></span> }
              Create Staff
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .form-body { display: flex; flex-direction: column; gap: 16px; }
    .action-btns { display: flex; gap: 6px; }
  `]
})
export class StaffListComponent implements OnInit {
  private staffService = inject(StaffService);
  private toast = inject(ToastService);

  staffList = signal<Staff[]>([]);
  loading = signal(false);
  saving = signal(false);
  showModal = signal(false);

  form: CreateStaffRequest = { name: '', role: 'LIBRARIAN', password: '' };

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.staffService.getAllStaff().subscribe({
      next: (res) => { this.staffList.set(res.data ?? []); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  isFormValid(): boolean {
    return !!(this.form.name.trim() && this.form.role && this.form.password.trim());
  }

  createStaff(): void {
    if (!this.isFormValid()) return;
    this.saving.set(true);
    this.staffService.createStaff(this.form).subscribe({
      next: (res) => {
        this.saving.set(false);
        if (res.success) {
          this.toast.success(`Staff member "${res.data.name}" created`);
          this.closeModal();
          this.load();
        }
      },
      error: () => this.saving.set(false),
    });
  }

  toggleStatus(s: Staff): void {
    this.staffService.updateStaffStatus(s.staff_id, { active: !s.active }).subscribe({
      next: () => {
        this.toast.success(`${s.name} ${s.active ? 'deactivated' : 'activated'}`);
        this.load();
      },
    });
  }

  deleteStaff(s: Staff): void {
    if (!confirm(`Delete ${s.name}? This cannot be undone.`)) return;
    this.staffService.deleteStaff(s.staff_id).subscribe({
      next: () => {
        this.toast.success(`${s.name} deleted`);
        this.load();
      },
    });
  }

  roleBadge(role: StaffRole): string {
    const m: Record<StaffRole, string> = {
      ADMIN: 'badge-danger',
      LIBRARIAN: 'badge-info',
      MANAGER: 'badge-warning',
    };
    return m[role] ?? 'badge-default';
  }

  closeModal(): void {
    this.showModal.set(false);
    this.form = { name: '', role: 'LIBRARIAN', password: '' };
  }

  onOverlay(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) this.closeModal();
  }
}
