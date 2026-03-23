import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BooksService } from '../../../core/services/books.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Book } from '../../../core/models';
import { BookFormModalComponent } from '../book-form-modal/book-form-modal.component';
import { BookCopiesModalComponent } from '../book-copies-modal/book-copies-modal.component';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BookFormModalComponent, BookCopiesModalComponent],
  template: `
    <div class="tab-row">
      <div class="tab-pills">
        <button class="tab-pill active">Books</button>
        @if (auth.isAdmin()) {
          <button class="tab-pill" (click)="router.navigate(['/staff'])">Staff</button>
        }
        @if (auth.isLibrarian()) {
          <button class="tab-pill" (click)="router.navigate(['/members'])">Members</button>
        }
      </div>
    </div>

    <div class="toolbar">
      <div class="search-bar">
        <span class="search-icon">⌕</span>
        <input type="text" [(ngModel)]="searchQuery" placeholder="Search Book" (keyup.enter)="search()" />
      </div>
      <button class="btn btn-secondary btn-sm" (click)="search()">Search</button>
      <span class="spacer"></span>
      @if (auth.isAdmin()) {
        <button class="btn btn-primary btn-sm" (click)="openAddModal()">Add Book <span>＋</span></button>
      }
      @if (auth.isManager()) {
        <button class="btn btn-secondary btn-sm" (click)="showReport.set(true)">📊 Create Report</button>
      }
    </div>

    <div class="section-title"><h2>Books</h2></div>

    <div class="table-wrap">
      @if (loading()) {
        <div class="loading-overlay"><span class="spinner"></span></div>
      } @else if (filteredBooks().length === 0) {
        <div class="empty-state">
          <div class="empty-icon">📚</div>
          <strong>No books found</strong>
          <p>{{ searchQuery ? 'Try a different search term.' : 'Add your first book to get started.' }}</p>
        </div>
      } @else {
        <table>
          <thead>
            <tr>
              <th>Book Id</th>
              <th>Book Name</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Copies</th>
              @if (auth.isAdmin()) {
                <th>Create Copies</th>
                <th>Edit</th>
              }
            </tr>
          </thead>
          <tbody>
            @for (book of filteredBooks(); track book.bookID) {
              <tr>
                <td>{{ book.bookID }}</td>
                <td><a routerLink="/books/{{ book.bookID }}" class="book-link">{{ book.bookName }}</a></td>
                <td>{{ book.author }}</td>
                <td><span class="font-mono text-muted">{{ book.isbn }}</span></td>
                <td>
                  <button class="btn btn-ghost btn-sm copies-btn" (click)="openCopies(book)">Copies</button>
                </td>
                @if (auth.isAdmin()) {
                  <td>
                    <button class="btn btn-ghost btn-sm" (click)="addCopy(book.bookID)" title="Add copy">＋</button>
                  </td>
                  <td>
                    <button class="btn btn-ghost btn-sm edit-btn" (click)="openEditModal(book)">Edit</button>
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      }
    </div>

    @if (showFormModal()) {
      <app-book-form-modal [book]="selectedBook()" (saved)="onBookSaved()" (closed)="showFormModal.set(false)" />
    }

    @if (showCopiesModal()) {
      <app-book-copies-modal [book]="selectedBook()!" (closed)="showCopiesModal.set(false)" (reload)="loadBooks()" />
    }

    @if (showReport()) {
      <div class="modal-overlay" (click)="showReport.set(false)">
        <div class="modal-box coming-soon-box" role="dialog" (click)="$event.stopPropagation()">
          <div class="cs-icon">📊</div>
          <h2>Reports</h2>
          <p class="cs-badge">Coming Soon</p>
          <p class="cs-desc">The reporting module is under development and will be available in a future release.</p>
          <button class="btn btn-primary" (click)="showReport.set(false)">Got it</button>
        </div>
      </div>
    }
  `,
  styles: [`
    .tab-row { display: flex; justify-content: center; margin-bottom: 20px; }
    .toolbar { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; .spacer { flex: 1; } }
    .section-title { margin-bottom: 0; h2 { font-size: 22px; font-weight: 700; margin-bottom: 12px; } }
    .book-link { color: var(--text-primary); font-weight: 500; &:hover { color: var(--accent-blue); } }
    .copies-btn { color: var(--accent-blue); }
    .edit-btn { color: var(--text-secondary); }
    .coming-soon-box {
      text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 40px 32px;
      .cs-icon { font-size: 48px; }
      h2 { font-size: 22px; }
      .cs-badge { background: var(--accent-blue-dim); color: var(--accent-blue); border: 1px solid var(--accent-border); border-radius: 20px; padding: 4px 18px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
      .cs-desc { font-size: 13px; color: var(--text-secondary); max-width: 280px; line-height: 1.6; }
    }
  `]
})
export class BooksListComponent implements OnInit {
  private booksService = inject(BooksService);
  auth = inject(AuthService);
  private toast = inject(ToastService);
  router = inject(Router);

  books = signal<Book[]>([]);
  loading = signal(false);
  searchQuery = '';
  showFormModal = signal(false);
  showCopiesModal = signal(false);
  showReport = signal(false);
  selectedBook = signal<Book | null>(null);

  filteredBooks = computed(() => {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.books();
    return this.books().filter(b =>
      b.bookName.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.toLowerCase().includes(q)
    );
  });

  ngOnInit(): void { this.loadBooks(); }

  loadBooks(): void {
    this.loading.set(true);
    this.booksService.getAllBooks().subscribe({
      next: (res) => { this.books.set(res.data ?? []); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  search(): void {}

  openAddModal(): void { this.selectedBook.set(null); this.showFormModal.set(true); }
  openEditModal(book: Book): void { this.selectedBook.set(book); this.showFormModal.set(true); }
  openCopies(book: Book): void { this.selectedBook.set(book); this.showCopiesModal.set(true); }

  addCopy(bookId: number): void {
    this.booksService.createBookCopy(bookId, { status: 'AVAILABLE' }).subscribe({
      next: () => { this.toast.success('Book copy created'); this.loadBooks(); },
    });
  }

  onBookSaved(): void { this.showFormModal.set(false); this.loadBooks(); }
}
