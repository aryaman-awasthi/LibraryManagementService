import { Component, OnInit, inject, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BooksService } from '../../../core/services/books.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Book, BookCopy } from '../../../core/models';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <div>
        <button class="btn btn-ghost btn-sm back-btn" (click)="router.navigate(['/books'])">
          ← Back
        </button>
        <h1>{{ book()?.bookName ?? 'Book Detail' }}</h1>
        @if (book()) {
          <p class="text-muted">by {{ book()!.author }}</p>
        }
      </div>
      @if (auth.isAdmin() && book()) {
        <div style="display:flex;gap:8px">
          <button class="btn btn-secondary btn-sm" (click)="addCopy()">＋ Add Copy</button>
          <button class="btn btn-danger btn-sm" (click)="deleteBook()">Delete Book</button>
        </div>
      }
    </div>

    @if (loading()) {
      <div class="loading-overlay"><span class="spinner"></span></div>
    } @else if (book()) {
      <!-- Info card -->
      <div class="card info-card">
        <div class="info-row">
          <span class="info-label">ISBN</span>
          <span class="font-mono">{{ book()!.isbn }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Author</span>
          <span>{{ book()!.author }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Total Copies</span>
          <span class="badge badge-info">{{ copies().length }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Available</span>
          <span class="badge badge-success">{{ availableCount() }}</span>
        </div>
        @if (book()!.createdAt) {
          <div class="info-row">
            <span class="info-label">Added On</span>
            <span>{{ formatDate(book()!.createdAt!) }}</span>
          </div>
        }
      </div>

      <!-- Copies table -->
      <div class="section-header">
        <h3>Copies</h3>
      </div>

      <div class="table-wrap">
        @if (copies().length === 0) {
          <div class="empty-state">
            <div class="empty-icon">📋</div>
            <strong>No copies yet</strong>
          </div>
        } @else {
          <table>
            <thead>
              <tr>
                <th>Copy ID</th>
                <th>Status</th>
                <th>Issued</th>
                <th>Member</th>
                <th>Issued At</th>
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
                    <span class="badge" [ngClass]="copy.issued ? 'badge-warning' : 'badge-success'">
                      {{ copy.issued ? 'Issued' : 'Available' }}
                    </span>
                  </td>
                  <td>{{ copy.memberName || '—' }}</td>
                  <td>{{ copy.issuedAt ? formatDate(copy.issuedAt) : '—' }}</td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div>
    }
  `,
  styles: [`
    .back-btn { margin-bottom: 6px; padding-left: 0; }
    .info-card {
      display: flex;
      flex-direction: column;
      gap: 0;
      padding: 0;
      overflow: hidden;
      margin-bottom: 24px;
    }
    .info-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      border-bottom: 1px solid var(--border-light);
      &:last-child { border-bottom: none; }
    }
    .info-label {
      font-size: 12px;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .section-header {
      margin: 0 0 12px;
      h3 { font-size: 16px; }
    }
  `]
})
export class BookDetailComponent implements OnInit {
  @Input() id!: string;

  private booksService = inject(BooksService);
  auth = inject(AuthService);
  private toast = inject(ToastService);
  router = inject(Router);

  book = signal<Book | null>(null);
  copies = signal<BookCopy[]>([]);
  loading = signal(false);

  availableCount = () => this.copies().filter(c => !c.issued && c.status === 'AVAILABLE').length;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    const id = Number(this.id);
    this.booksService.getBookById(id).subscribe({
      next: (res) => {
        this.book.set(res.data);
        this.loadCopies(id);
      },
      error: () => this.loading.set(false),
    });
  }

  loadCopies(id: number): void {
    this.booksService.getBookCopies(id).subscribe({
      next: (res) => {
        this.copies.set(res.data ?? []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  addCopy(): void {
    this.booksService.createBookCopy(Number(this.id), { status: 'AVAILABLE' }).subscribe({
      next: () => {
        this.toast.success('Copy added');
        this.loadCopies(Number(this.id));
      },
    });
  }

  deleteBook(): void {
    if (!confirm('Delete this book? This cannot be undone.')) return;
    this.booksService.deleteBook(Number(this.id)).subscribe({
      next: () => {
        this.toast.success('Book deleted');
        this.router.navigate(['/books']);
      },
    });
  }

  statusBadge(status: string): string {
    const m: Record<string, string> = { AVAILABLE: 'badge-success', DAMAGED: 'badge-danger', LOST: 'badge-warning' };
    return m[status] ?? 'badge-default';
  }

  formatDate(d: string): string {
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
