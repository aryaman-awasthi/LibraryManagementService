import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BooksService } from '../../../core/services/books.service';
import { ToastService } from '../../../core/services/toast.service';
import { AddBookRequest } from '../../../core/models';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div>
        <button class="btn btn-ghost btn-sm" (click)="router.navigate(['/books'])">← Back</button>
        <h1>Add New Book</h1>
      </div>
    </div>

    <div class="card form-card">
      <div class="form-group">
        <label>Book Name <span style="color:var(--danger)">*</span></label>
        <input type="text" [(ngModel)]="form.bookName" placeholder="e.g. Clean Code" />
      </div>
      <div class="form-group">
        <label>Author <span style="color:var(--danger)">*</span></label>
        <input type="text" [(ngModel)]="form.author" placeholder="e.g. Robert C. Martin" />
      </div>
      <div class="form-group">
        <label>ISBN <span style="color:var(--danger)">*</span></label>
        <input type="text" [(ngModel)]="form.isbn" placeholder="e.g. 9780132350884" />
      </div>
      <div class="form-actions">
        <button class="btn btn-secondary" (click)="router.navigate(['/books'])">Cancel</button>
        <button class="btn btn-primary" (click)="save()" [disabled]="saving() || !isValid()">
          @if (saving()) { <span class="spinner"></span> }
          Add Book
        </button>
      </div>
    </div>
  `,
  styles: [`
    .form-card {
      max-width: 520px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      padding-top: 8px;
      border-top: 1px solid var(--border-light);
    }
  `]
})
export class BookFormComponent {
  private booksService = inject(BooksService);
  private toast = inject(ToastService);
  router = inject(Router);

  saving = signal(false);
  form: AddBookRequest = { bookName: '', author: '', isbn: '' };

  isValid() {
    return this.form.bookName.trim() && this.form.author.trim() && this.form.isbn.trim();
  }

  save() {
    if (!this.isValid()) return;
    this.saving.set(true);
    this.booksService.addBook(this.form).subscribe({
      next: (res) => {
        this.saving.set(false);
        if (res.success) {
          this.toast.success('Book added successfully');
          this.router.navigate(['/books']);
        }
      },
      error: () => this.saving.set(false),
    });
  }
}
