// ===== API Response Wrapper =====
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ===== Staff / Auth =====
export interface Staff {
  staff_id: number;
  name: string;
  role: StaffRole;
  active: boolean;
}

export type StaffRole = 'ADMIN' | 'LIBRARIAN' | 'MANAGER';

export interface LoginRequest {
  staff_id: number;
  password: string;
}

export interface CreateStaffRequest {
  name: string;
  role: StaffRole;
  password: string;
}

export interface UpdateStaffRequest {
  active: boolean;
}

// ===== Books =====
export interface Book {
  bookID: number;
  bookName: string;
  isbn: string;
  author: string;
  createdAt?: string;
}

export interface AddBookRequest {
  bookName: string;
  isbn: string;
  author: string;
}

// ===== Book Copies =====
export type BookCopyStatus = 'AVAILABLE' | 'DAMAGED' | 'LOST';

export interface BookCopy {
  bookCopyId: number;
  bookId: number;
  bookName: string;
  status: BookCopyStatus;
  issued: boolean;
  memberId: number | null;
  memberName: string | null;
  issuedAt: string | null;
  createdAt?: string;
}

export interface CreateBookCopyRequest {
  status?: BookCopyStatus;
}

// ===== Members =====
export interface Member {
  memberID: number;
  name: string;
  createdAt: string;
}

export interface CreateMemberRequest {
  name: string;
}

// ===== Issues =====
export type IssueStatus = 'issued' | 'returned';

export interface IssueRecord {
  issueId: number;
  bookCopyId: number;
  bookId: number;
  bookName: string;
  memberId: number;
  memberName: string;
  issuedAt: string;
  status: IssueStatus;
}

export interface IssueRequest {
  memberID: number;
  bookCopyID: number;
}

// ===== Auth State =====
export interface AuthState {
  staff: Staff | null;
  isLoggedIn: boolean;
}
