import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-shell">
      <!-- Left panel – quote -->
      <div class="quote-panel">
        <p class="quote-text">
          "The only thing that you absolutely have to know, is the location of the library."
        </p>
        <span class="quote-author">- Albert Einstein</span>
      </div>

      <!-- Right panel – form -->
      <div class="form-panel">
        <p class="brand">Library Management System</p>

        <div class="form-card">
          <h1>Log In</h1>

          <div class="form-group">
            <input
              type="number"
              [(ngModel)]="staffId"
              placeholder="userid"
              [disabled]="loading"
              (keyup.enter)="login()"
            />
          </div>

          <div class="form-group">
            <input
              type="password"
              [(ngModel)]="password"
              placeholder="password"
              [disabled]="loading"
              (keyup.enter)="login()"
            />
          </div>

          @if (errorMsg) {
            <p class="error-banner">{{ errorMsg }}</p>
          }

          <button
            class="login-btn"
            (click)="login()"
            [disabled]="loading || !staffId || !password"
          >
            @if (loading) {
              <span class="spinner"></span>
            } @else {
              Log In
            }
          </button>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-shell {
      min-height: 100vh;
      display: flex;
      background: var(--bg-primary);
    }

    /* ── Quote panel ── */
    .quote-panel {
      flex: 1;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      text-align: center;
    }

    .quote-text {
      font-family: var(--font-serif);
      font-style: italic;
      font-size: 26px;
      color: #1a1a1a;
      line-height: 1.5;
      max-width: 380px;
    }

    .quote-author {
      margin-top: 24px;
      font-family: var(--font-serif);
      font-size: 14px;
      color: #555;
    }

    /* ── Form panel ── */
    .form-panel {
      width: 420px;
      flex-shrink: 0;
      background: var(--bg-primary);
      display: flex;
      flex-direction: column;
      align-items: stretch;
      padding: 28px 40px;
    }

    .brand {
      text-align: right;
      font-size: 13px;
      color: var(--text-secondary);
      margin-bottom: auto;
      padding-top: 8px;
    }

    .form-card {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 16px;
      padding-bottom: 48px;

      h1 {
        font-size: 28px;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 8px;
      }
    }

    .error-banner {
      font-size: 12px;
      color: var(--danger);
      background: rgba(248,81,73,0.1);
      border: 1px solid rgba(248,81,73,0.3);
      border-radius: var(--radius-sm);
      padding: 8px 12px;
    }

    .login-btn {
      width: 100%;
      padding: 12px;
      background: var(--accent-blue);
      color: #fff;
      border: none;
      border-radius: var(--radius-md);
      font-size: 14px;
      font-weight: 600;
      font-family: var(--font-sans);
      cursor: pointer;
      transition: all var(--transition);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-height: 44px;

      &:hover:not(:disabled) {
        background: var(--accent-blue-hover);
        transform: translateY(-1px);
        box-shadow: 0 4px 14px rgba(74,144,217,0.35);
      }

      &:disabled { opacity: 0.6; cursor: not-allowed; }
    }


    @media (max-width: 700px) {
      .login-shell { flex-direction: column; }
      .quote-panel { padding: 32px 24px; flex: none; min-height: 220px; }
      .quote-text { font-size: 18px; }
      .form-panel { width: 100%; padding: 28px 24px; }
    }
  `]
})
export class LoginComponent {
  staffId: number | null = null;
  password = '';
  loading = false;
  errorMsg = '';

  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  login(): void {
    if (!this.staffId || !this.password) return;
    this.loading = true;
    this.errorMsg = '';

    this.auth.login({ staff_id: this.staffId, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.toast.success(`Welcome, ${res.data.name}!`);
          this.router.navigate(['/books']);
        } else {
          this.errorMsg = res.message || 'Login failed';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Invalid credentials';
      }
    });
  }
}
