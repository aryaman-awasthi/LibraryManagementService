import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="app-shell">
      <!-- Navbar -->
      <header class="navbar">
        <div class="navbar-inner">
          <span class="navbar-brand">Library Management System</span>

          <nav class="navbar-nav">
            <a routerLink="/books" routerLinkActive="active">Home</a>
            @if (auth.isAdmin()) {
              <a routerLink="/staff" routerLinkActive="active">Staff</a>
            }
            @if (auth.isLibrarian() || auth.isAdmin()) {
              <a routerLink="/members" routerLinkActive="active">Members</a>
            }
            <a routerLink="/profile" routerLinkActive="active">Profile</a>
            <button class="btn-logout" (click)="auth.logout()">Log out</button>
          </nav>
        </div>
      </header>

      <!-- Main -->
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app-shell {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: var(--bg-primary);
    }

    .navbar {
      background: var(--bg-primary);
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .navbar-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .navbar-brand {
      font-size: 15px;
      font-weight: 600;
      color: var(--text-primary);
      letter-spacing: -0.2px;
    }

    .navbar-nav {
      display: flex;
      align-items: center;
      gap: 4px;

      a {
        padding: 6px 14px;
        border-radius: var(--radius-md);
        font-size: 13px;
        font-weight: 500;
        color: var(--text-secondary);
        text-decoration: none;
        transition: all var(--transition);

        &:hover { color: var(--text-primary); background: var(--bg-card); }
        &.active {
          color: var(--text-primary);
          text-decoration: underline;
          text-underline-offset: 4px;
        }
      }
    }

    .btn-logout {
      padding: 6px 14px;
      border-radius: var(--radius-md);
      font-size: 13px;
      font-weight: 500;
      color: var(--text-secondary);
      background: none;
      border: none;
      cursor: pointer;
      font-family: var(--font-sans);
      transition: all var(--transition);

      &:hover { color: var(--danger); background: rgba(248,81,73,0.08); }
    }

    .main-content {
      flex: 1;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      padding: 28px 24px;
    }
  `]
})
export class LayoutComponent {
  auth = inject(AuthService);
}
