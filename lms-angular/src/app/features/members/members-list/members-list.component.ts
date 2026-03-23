import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MembersService } from '../../../core/services/members.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Member } from '../../../core/models';

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Tab pills matching books page pattern -->
    <div class="tab-row">
      <div class="tab-pills">
        @if (auth.isLibrarian()) {
          <button class="tab-pill" (click)="router.navigate(['/books'])">Books</button>
        }
        <button class="tab-pill active">Members</button>
      </div>
    </div>

    <div class="page-header">
      <div>
        <h1>Members</h1>
        <p class="text-muted">Registered library members</p>
      </div>
      <button class="btn btn-primary btn-sm" (click)="showAddModal.set(true)">＋ Add Member</button>
    </div>

    <!-- Fine calculator -->
    <div class="fine-bar card">
      <span class="fine-label">Calculate Fine</span>
      <input type="number" [(ngModel)]="fineCopyId" placeholder="Book Copy ID" style="width:160px" />
      <button class="btn btn-secondary btn-sm" (click)="calcFine()" [disabled]="!fineCopyId || calcingFine()">
        @if (calcingFine()) { <span class="spinner"></span> } @else { Calculate }
      </button>
      @if (fineResult() !== null) {
        <span class="fine-result">Fine: <strong>₹{{ fineResult() }}</strong></span>
      }
    </div>

    <div class="table-wrap">
      @if (loading()) {
        <div class="loading-overlay"><span class="spinner"></span></div>
      } @else if (members().length === 0) {
        <div class="empty-state">
          <div class="empty-icon">🧑‍💼</div>
          <strong>No members yet</strong>
          <p>Register the first library member.</p>
        </div>
      } @else {
        <table>
          <thead>
            <tr>
              <th>Member ID</th>
              <th>Name</th>
              <th>Registered On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (m of members(); track m.memberID) {
              <tr>
                <td class="font-mono">{{ m.memberID }}</td>
                <td>{{ m.name }}</td>
                <td>{{ formatDate(m.createdAt) }}</td>
                <td>
                  <div class="action-btns">
                    <button class="btn btn-ghost btn-sm issue-btn" (click)="openIssue(m)">
                      Issue Book
                    </button>
                    <button class="btn btn-ghost btn-sm return-btn" (click)="openReturn(m)">
                      Return Book
                    </button>
                    <button class="btn btn-danger btn-sm" (click)="deleteMember(m)">Delete</button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>

    <!-- Add member modal -->
    @if (showAddModal()) {
      <div class="modal-overlay" (click)="onOverlay($event, 'add')">
        <div class="modal-box" role="dialog">
          <div class="modal-header">
            <h3>Register Member</h3>
            <button class="modal-close" (click)="showAddModal.set(false)">✕</button>
          </div>
          <div class="form-group">
            <label>Member Name *</label>
            <input
              type="text"
              [(ngModel)]="newMemberName"
              placeholder="Full name"
              (keyup.enter)="addMember()"
            />
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="showAddModal.set(false)">Cancel</button>
            <button class="btn btn-primary" (click)="addMember()" [disabled]="saving() || !newMemberName.trim()">
              @if (saving()) { <span class="spinner"></span> }
              Register
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Issue book modal -->
    @if (showIssueModal()) {
      <div class="modal-overlay" (click)="onOverlay($event, 'issue')">
        <div class="modal-box" role="dialog">
          <div class="modal-header">
            <h3>Issue Book</h3>
            <button class="modal-close" (click)="showIssueModal.set(false)">✕</button>
          </div>
          <div class="member-info-row">
            <span class="member-chip">Member: <strong>{{ issuingMember()?.name }}</strong> (ID: {{ issuingMember()?.memberID }})</span>
          </div>
          <div class="form-body">
            <div class="form-group">
              <label>Book Copy ID *</label>
              <input
                type="number"
                [(ngModel)]="issueCopyId"
                placeholder="Enter copy ID"
                (keyup.enter)="confirmIssue()"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="showIssueModal.set(false)">Cancel</button>
            <button class="btn btn-primary" (click)="confirmIssue()" [disabled]="issuing() || !issueCopyId">
              @if (issuing()) { <span class="spinner"></span> }
              Issue Book
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Return book modal -->
    @if (showReturnModal()) {
      <div class="modal-overlay" (click)="onOverlay($event, 'return')">
        <div class="modal-box" role="dialog">
          <div class="modal-header">
            <h3>Return Book</h3>
            <button class="modal-close" (click)="showReturnModal.set(false)">✕</button>
          </div>
          <div class="member-info-row">
            <span class="member-chip">Member: <strong>{{ returningMember()?.name }}</strong> (ID: {{ returningMember()?.memberID }})</span>
          </div>
          <div class="form-body">
            <div class="form-group">
              <label>Book Copy ID *</label>
              <input
                type="number"
                [(ngModel)]="returnCopyId"
                placeholder="Enter copy ID to return"
                (keyup.enter)="confirmReturn()"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="showReturnModal.set(false)">Cancel</button>
            <button class="btn btn-success" (click)="confirmReturn()" [disabled]="returning() || !returnCopyId">
              @if (returning()) { <span class="spinner"></span> }
              Confirm Return
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .tab-row { display: flex; justify-content: center; margin-bottom: 20px; }

    .fine-bar {
      display: flex; align-items: center; gap: 12px; padding: 14px 20px; margin-bottom: 20px; flex-wrap: wrap;
      .fine-label { font-size: 13px; font-weight: 500; color: var(--text-secondary); white-space: nowrap; }
      .fine-result { font-size: 13px; color: var(--warning); strong { font-size: 15px; } }
    }

    .form-body { display: flex; flex-direction: column; gap: 16px; }
    .action-btns { display: flex; gap: 6px; flex-wrap: wrap; }
    .issue-btn { color: var(--accent-blue); }
    .return-btn { color: var(--success); }

    .member-info-row {
      margin-bottom: 16px;
      .member-chip {
        display: inline-flex;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        padding: 6px 12px;
        font-size: 13px;
        color: var(--text-secondary);
        strong { color: var(--text-primary); margin-left: 4px; }
      }
    }
  `]
})
export class MembersListComponent implements OnInit {
  private membersService = inject(MembersService);
  auth = inject(AuthService);
  private toast = inject(ToastService);
  router = inject(Router);

  members = signal<Member[]>([]);
  loading = signal(false);
  saving = signal(false);
  issuing = signal(false);
  returning = signal(false);
  calcingFine = signal(false);

  showAddModal = signal(false);
  showIssueModal = signal(false);
  showReturnModal = signal(false);

  newMemberName = '';
  fineCopyId: number | null = null;
  fineResult = signal<number | null>(null);

  issuingMember = signal<Member | null>(null);
  returningMember = signal<Member | null>(null);
  issueCopyId: number | null = null;
  returnCopyId: number | null = null;

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.membersService.getAllMembers().subscribe({
      next: (res) => { this.members.set(res.data ?? []); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  addMember(): void {
    if (!this.newMemberName.trim()) return;
    this.saving.set(true);
    this.membersService.createMember({ name: this.newMemberName }).subscribe({
      next: (res) => {
        this.saving.set(false);
        if (res.success) {
          this.toast.success(`Member "${res.data.name}" registered`);
          this.newMemberName = '';
          this.showAddModal.set(false);
          this.load();
        }
      },
      error: () => this.saving.set(false),
    });
  }

  deleteMember(m: Member): void {
    if (!confirm(`Delete member ${m.name}? This cannot be undone.`)) return;
    this.membersService.deleteMember(m.memberID).subscribe({
      next: () => { this.toast.success('Member deleted'); this.load(); },
    });
  }

  openIssue(m: Member): void {
    this.issuingMember.set(m);
    this.issueCopyId = null;
    this.showIssueModal.set(true);
  }

  confirmIssue(): void {
    if (!this.issuingMember() || !this.issueCopyId) return;
    this.issuing.set(true);
    this.membersService.issueBook({
      memberID: this.issuingMember()!.memberID,
      bookCopyID: this.issueCopyId,
    }).subscribe({
      next: (res) => {
        this.issuing.set(false);
        if (res.success) {
          this.toast.success(`Book copy #${this.issueCopyId} issued to ${this.issuingMember()!.name}`);
          this.showIssueModal.set(false);
        }
      },
      error: () => this.issuing.set(false),
    });
  }

  openReturn(m: Member): void {
    this.returningMember.set(m);
    this.returnCopyId = null;
    this.showReturnModal.set(true);
  }

  confirmReturn(): void {
    if (!this.returnCopyId) return;
    this.returning.set(true);
    this.membersService.returnBook(this.returnCopyId).subscribe({
      next: (res) => {
        this.returning.set(false);
        if (res.success) {
          this.toast.success(`Book copy #${this.returnCopyId} returned successfully`);
          this.showReturnModal.set(false);
        }
      },
      error: () => this.returning.set(false),
    });
  }

  calcFine(): void {
    if (!this.fineCopyId) return;
    this.calcingFine.set(true);
    this.fineResult.set(null);
    this.membersService.calculateFine(this.fineCopyId).subscribe({
      next: (res) => {
        this.calcingFine.set(false);
        if (res.success) {
          this.fineResult.set(res.data);
          this.toast.info(`Fine for copy #${this.fineCopyId}: ₹${res.data}`);
        }
      },
      error: () => this.calcingFine.set(false),
    });
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  onOverlay(e: MouseEvent, modal: 'add' | 'issue' | 'return'): void {
    if (!(e.target as HTMLElement).classList.contains('modal-overlay')) return;
    if (modal === 'add') this.showAddModal.set(false);
    if (modal === 'issue') this.showIssueModal.set(false);
    if (modal === 'return') this.showReturnModal.set(false);
  }
}
