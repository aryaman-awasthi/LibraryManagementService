import { Component, Input, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BooksService } from '../../../core/services/books.service';
import { MembersService } from '../../../core/services/members.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Book, BookCopy } from '../../../core/models';

@Component({
  selector: 'app-book-copies-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="onOverlayClick($event)">
      <div class="modal-box modal-lg" role="dialog">
        <div class="modal-header">
          <div>
            <h3>Book Copies</h3>
            <p class="text-muted" style="font-size:12px">{{ book.bookName }}</p>
          </div>
          <div style="display:flex;gap:8px;align-items:center">
            @if (auth.isAdmin()) {
              <button class="btn btn-primary btn-sm" (click)="addCopy()" [disabled]="addingCopy()">
                @if (addingCopy()) { <span class="spinner"></span> } @else { ＋ Add Copy }
              </button>
            }
            <button class="modal-close" (click)="closed.emit()">✕</button>
          </div>
        </div>

        @if (loading()) {
          <div class="loading-overlay"><span class="spinner"></span></div>
        } @else if (copies().length === 0) {
          <div class="empty-state">
            <div class="empty-icon">📋</div>
            <strong>No copies yet</strong>
            <p>Add a copy to start issuing this book.</p>
          </div>
        } @else {
          <div class="table-wrap" style="margin-top:0;border-radius:var(--radius-md)">
            <table>
              <thead>
                <tr>
                  <th>Copy ID</th>
                  <th>Status</th>
                  <th>Issued</th>
                  <th>Member</th>
                  <th>Issued At</th>
                  @if (auth.isLibrarian() || auth.isAdmin()) {
                    <th>Actions</th>
                  }
                </tr>
              </thead>
              <tbody>
                @for (copy of copies(); track copy.bookCopyId) {
                  <tr>
                    <td>#{{ copy.bookCopyId }}</td>
                    <td>
                      <span class="badge" [ngClass]="statusBadge(copy.status)">{{ copy.status }}</span>
                    </td>
                    <td>
                      <span class="badge" [ngClass]="isIssued(copy) ? 'badge-warning' : 'badge-success'">
                        {{ isIssued(copy) ? 'Issued' : 'Free' }}
                      </span>
                    </td>
                    <td>{{ copy.memberName || '—' }}</td>
                    <td>{{ copy.issuedAt ? formatDate(copy.issuedAt) : '—' }}</td>
                    @if (auth.isLibrarian() || auth.isAdmin()) {
                      <td>
                        @if (!isIssued(copy)) {
                          <button class="btn btn-sm btn-secondary issue-action" (click)="openIssue(copy)">
                            Issue
                          </button>
                        } @else {
                          <button class="btn btn-sm btn-success return-action" (click)="returnCopy(copy)">
                            Return
                          </button>
                        }
                      </td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        <!-- Issue sub-form -->
        @if (issuing()) {
          <div class="issue-panel">
            <h4>Issue Copy #{{ issuingCopy()?.bookCopyId }} — {{ book.bookName }}</h4>
            <div class="form-group">
              <label>Member ID</label>
              <input
                type="number"
                [(ngModel)]="memberIdInput"
                placeholder="Enter member ID"
                (keyup.enter)="confirmIssue()"
                autofocus
              />
            </div>
            <div class="issue-actions">
              <button class="btn btn-secondary btn-sm" (click)="issuing.set(false)">Cancel</button>
              <button
                class="btn btn-primary btn-sm"
                (click)="confirmIssue()"
                [disabled]="confirmingIssue() || !memberIdInput"
              >
                @if (confirmingIssue()) { <span class="spinner"></span> }
                Confirm Issue
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .issue-panel {
      margin-top: 16px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      h4 { font-size: 13px; font-weight: 600; color: var(--text-secondary); }
    }
    .issue-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .issue-action { color: var(--accent-blue); border-color: var(--accent-blue); }
    .return-action { color: var(--success); border-color: var(--success); }
  `]
})
export class BookCopiesModalComponent implements OnInit {
  @Input() book!: Book;
  @Output() closed = new EventEmitter<void>();
  @Output() reload = new EventEmitter<void>();

  private booksService = inject(BooksService);
  private membersService = inject(MembersService);
  auth = inject(AuthService);
  private toast = inject(ToastService);

  copies = signal<BookCopy[]>([]);
  loading = signal(false);
  addingCopy = signal(false);
  issuing = signal(false);
  confirmingIssue = signal(false);
  issuingCopy = signal<BookCopy | null>(null);
  memberIdInput: number | null = null;

  ngOnInit(): void { this.loadCopies(); }

  /** Safely determine if a copy is issued — handles null from backend */
  isIssued(copy: BookCopy): boolean {
    // Backend may return null for `issued` field on new copies
    // Fall back to checking memberId or status
    if (copy.issued !== null && copy.issued !== undefined) return copy.issued;
    return copy.memberId !== null && copy.memberId !== undefined;
  }

  loadCopies(): void {
    this.loading.set(true);
    this.booksService.getBookCopies(this.book.bookID).subscribe({
      next: (res) => { this.copies.set(res.data ?? []); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  addCopy(): void {
    this.addingCopy.set(true);
    // Send empty body — backend defaults status to AVAILABLE
    this.booksService.createBookCopy(this.book.bookID, {}).subscribe({
      next: () => {
        this.toast.success('Copy added successfully');
        this.addingCopy.set(false);
        this.loadCopies();
        this.reload.emit();
      },
      error: () => this.addingCopy.set(false),
    });
  }

  openIssue(copy: BookCopy): void {
    this.issuingCopy.set(copy);
    this.memberIdInput = null;
    this.issuing.set(true);
  }

  confirmIssue(): void {
    if (!this.memberIdInput || !this.issuingCopy()) return;
    this.confirmingIssue.set(true);
    this.membersService.issueBook({
      memberID: this.memberIdInput,
      bookCopyID: this.issuingCopy()!.bookCopyId,
    }).subscribe({
      next: (res) => {
        this.confirmingIssue.set(false);
        if (res.success) {
          this.toast.success(`Book issued to member #${this.memberIdInput}`);
          this.issuing.set(false);
          this.loadCopies();
        }
      },
      error: () => this.confirmingIssue.set(false),
    });
  }

  returnCopy(copy: BookCopy): void {
    this.membersService.returnBook(copy.bookCopyId).subscribe({
      next: (res) => {
        if (res.success) {
          this.toast.success('Book returned successfully');
          this.loadCopies();
        }
      },
    });
  }

  statusBadge(status: string): string {
    const map: Record<string, string> = {
      AVAILABLE: 'badge-success',
      DAMAGED: 'badge-danger',
      LOST: 'badge-warning',
    };
    return map[status] ?? 'badge-default';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

  onOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) this.closed.emit();
  }
}
