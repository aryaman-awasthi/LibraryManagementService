import { Component, Input, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BooksService } from '../../../core/services/books.service';
import { ToastService } from '../../../core/services/toast.service';
import { Book, AddBookRequest } from '../../../core/models';

@Component({
  selector: 'app-book-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="onOverlayClick($event)">
      <div class="modal-box" role="dialog">
        <div class="modal-header">
          <h3>{{ book ? 'Edit Book' : 'Add New Book' }}</h3>
          <button class="modal-close" (click)="closed.emit()">✕</button>
        </div>

        <div class="form-body">
          <div class="form-group">
            <label>Book Name <span class="required">*</span></label>
            <input
              type="text"
              [(ngModel)]="form.bookName"
              placeholder="e.g. Clean Code"
              [disabled]="saving()"
            />
          </div>

          <div class="form-group">
            <label>Author <span class="required">*</span></label>
            <input
              type="text"
              [(ngModel)]="form.author"
              placeholder="e.g. Robert C. Martin"
              [disabled]="saving()"
            />
          </div>

          <div class="form-group">
            <label>ISBN <span class="required">*</span></label>
            <input
              type="text"
              [(ngModel)]="form.isbn"
              placeholder="e.g. 9780132350884"
              [disabled]="saving()"
            />
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="closed.emit()" [disabled]="saving()">
            Cancel
          </button>
          <button class="btn btn-primary" (click)="save()" [disabled]="saving() || !isValid()">
            @if (saving()) { <span class="spinner"></span> }
            {{ book ? 'Update' : 'Add Book' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-body { display: flex; flex-direction: column; gap: 16px; }
    .required { color: var(--danger); }
  `]
})
export class BookFormModalComponent implements OnInit {
  @Input() book: Book | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  private booksService = inject(BooksService);
  private toast = inject(ToastService);

  saving = signal(false);
  form: AddBookRequest = { bookName: '', author: '', isbn: '' };

  ngOnInit(): void {
    if (this.book) {
      this.form = {
        bookName: this.book.bookName,
        author: this.book.author,
        isbn: this.book.isbn,
      };
    }
  }

  isValid(): boolean {
    return !!(this.form.bookName.trim() && this.form.author.trim() && this.form.isbn.trim());
  }

  save(): void {
    if (!this.isValid()) return;
    this.saving.set(true);

    const call$ = this.booksService.addBook(this.form);

    call$.subscribe({
      next: (res) => {
        this.saving.set(false);
        if (res.success) {
          this.toast.success(this.book ? 'Book updated' : 'Book added successfully');
          this.saved.emit();
        } else {
          this.toast.error(res.message);
        }
      },
      error: () => this.saving.set(false),
    });
  }

  onOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closed.emit();
    }
  }
}
