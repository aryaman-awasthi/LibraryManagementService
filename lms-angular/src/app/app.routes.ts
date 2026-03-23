import { Routes } from '@angular/router';
import { authGuard, guestGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./shared/components/layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: 'books',
        loadComponent: () =>
          import('./features/books/books-list/books-list.component').then((m) => m.BooksListComponent),
      },
      {
        path: 'books/add',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/books/book-form/book-form.component').then((m) => m.BookFormComponent),
      },
      {
        path: 'books/:id',
        loadComponent: () =>
          import('./features/books/book-detail/book-detail.component').then((m) => m.BookDetailComponent),
      },
      {
        path: 'staff',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/staff/staff-list/staff-list.component').then((m) => m.StaffListComponent),
      },
      {
        path: 'members',
        loadComponent: () =>
          import('./features/members/members-list/members-list.component').then((m) => m.MembersListComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/auth/profile/profile.component').then((m) => m.ProfileComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
