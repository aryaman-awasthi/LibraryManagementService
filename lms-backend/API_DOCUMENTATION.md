# LMS Backend API Documentation

Base URL: `http://localhost:8080`

## Response Format

Most endpoints return data in this wrapper:

```json
{
  "success": true,
  "message": "string",
  "data": {}
}
```

Error responses are currently handled globally and usually come back as HTTP `500`:

```json
{
  "success": false,
  "message": "An unexpected error occurred: <reason>",
  "data": null
}
```

## Enums

### Staff roles

`LIBRARIAN`, `MANAGER`, `ADMIN`

### Book copy status

`AVAILABLE`, `DAMAGED`, `LOST`

### Issue transaction status

`issued`, `returned`

## Admin APIs

### 1. Create Staff

- Method: `POST`
- Endpoint: `/api/admin/create`
- What it does: Creates a new staff record and marks it active by default.

Sample request:

```json
{
  "name": "Rahul Sharma",
  "role": "LIBRARIAN",
  "password": "rahul@123"
}
```

Sample response:

```json
{
  "success": true,
  "message": "Staff Created",
  "data": {
    "staff_id": 1,
    "name": "Rahul Sharma",
    "role": "LIBRARIAN",
    "active": true
  }
}
```

### 2. Get All Staff

- Method: `GET`
- Endpoint: `/api/admin/getStaff`
- What it does: Returns all staff members.

Sample response:

```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "staff_id": 1,
      "name": "Rahul Sharma",
      "role": "LIBRARIAN",
      "active": true
    },
    {
      "staff_id": 2,
      "name": "Neha Singh",
      "role": "MANAGER",
      "active": true
    }
  ]
}
```

### 3. Get Staff By ID

- Method: `GET`
- Endpoint: `/api/admin/getStaff/{staff_id}`
- What it does: Returns one staff member by ID.

Example: `/api/admin/getStaff/1`

Sample response:

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "staff_id": 1,
    "name": "Rahul Sharma",
    "role": "LIBRARIAN",
    "active": true
  }
}
```

### 4. Update Staff Active Status

- Method: `PUT`
- Endpoint: `/api/admin/update/{staff_id}`
- What it does: Updates only the `active` status of a staff member.

Sample request:

```json
{
  "active": false
}
```

Sample response:

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "staff_id": 1,
    "name": "Rahul Sharma",
    "role": "LIBRARIAN",
    "active": false
  }
}
```

### 5. Delete Staff

- Method: `DELETE`
- Endpoint: `/api/admin/delete/{staff_id}`
- What it does: Deletes a staff member by ID.

Example: `/api/admin/delete/1`

Sample response:

```json
{
  "success": true,
  "message": "Success",
  "data": "deleted"
}
```

### 6. Staff Login

- Method: `POST`
- Endpoint: `/api/admin/login`
- What it does: Authenticates admin or staff credentials and returns staff details.

Sample request:

```json
{
  "staff_id": 1,
  "password": "rahul@123"
}
```

Sample response:

```json
{
  "success": true,
  "message": "logged in",
  "data": {
    "staff_id": 1,
    "name": "Rahul Sharma",
    "role": "LIBRARIAN",
    "active": true
  }
}
```

Admin login request:

```json
{
  "staff_id": 10101010,
  "password": "qwerty@123"
}
```

Admin login response:

```json
{
  "success": true,
  "message": "logged in",
  "data": {
    "staff_id": 10101010,
    "name": "admin",
    "role": "ADMIN",
    "active": true
  }
}
```

## Book APIs

### 7. Add Book

- Method: `POST`
- Endpoint: `/api/books/add`
- What it does: Creates a new book record. ISBN must be unique.

Sample request:

```json
{
  "bookName": "Clean Code",
  "isbn": "9780132350884",
  "author": "Robert C. Martin"
}
```

Sample response:

```json
{
  "success": true,
  "message": "added book",
  "data": {
    "bookID": 1,
    "bookName": "Clean Code",
    "isbn": "9780132350884",
    "author": "Robert C. Martin",
    "createdAt": "2026-03-23T10:15:30.123456"
  }
}
```

### 8. Get All Books

- Method: `GET`
- Endpoint: `/api/books/getBooks`
- What it does: Returns all books.

Sample response:

```json
{
  "success": true,
  "message": "fetched all books successfully",
  "data": [
    {
      "bookID": 1,
      "bookName": "Clean Code",
      "isbn": "9780132350884",
      "author": "Robert C. Martin",
      "createdAt": "2026-03-23T10:15:30.123456"
    }
  ]
}
```

### 9. Get Book By ID

- Method: `GET`
- Endpoint: `/api/books/getBook/{bookID}`
- What it does: Returns one book by ID.

Example: `/api/books/getBook/1`

Sample response:

```json
{
  "success": true,
  "message": "fetched book successfully",
  "data": {
    "bookID": 1,
    "bookName": "Clean Code",
    "isbn": "9780132350884",
    "author": "Robert C. Martin",
    "createdAt": "2026-03-23T10:15:30.123456"
  }
}
```

### 10. Delete Book

- Method: `DELETE`
- Endpoint: `/api/books/delete/{bookID}`
- What it does: Deletes a book by ID.

Example: `/api/books/delete/1`

Sample response:

```json
{
  "success": true,
  "message": "Successfully deleted",
  "data": "deleted"
}
```

## Book Copy APIs

### 11. Create Book Copy

- Method: `POST`
- Endpoint: `/api/books/create/book_copy/{id}`
- What it does: Creates a physical copy for a book. If `status` is not sent, it defaults to `AVAILABLE`.

Example: `/api/books/create/book_copy/1`

Sample request:

```json
{
  "status": "AVAILABLE"
}
```

Sample response:

```json
{
  "success": true,
  "message": "book copy created",
  "data": {
    "bookCopyId": 1,
    "bookId": 1,
    "bookName": "Clean Code",
    "status": "AVAILABLE",
    "issued": false,
    "createdAt": "2026-03-23T10:20:00.654321"
  }
}
```

### 12. Get All Copies For a Book

- Method: `GET`
- Endpoint: `/api/books/get/book_copies/{book_id}`
- What it does: Returns all physical copies for a specific book, including issue details if a copy is currently issued.

Example: `/api/books/get/book_copies/1`

Sample response:

```json
{
  "success": true,
  "message": "fetched all book copies",
  "data": [
    {
      "bookCopyId": 1,
      "bookId": 1,
      "bookName": "Clean Code",
      "status": "AVAILABLE",
      "issued": false,
      "memberId": null,
      "memberName": null,
      "issuedAt": null
    }
  ]
}
```

### 13. Get Book Copy Count

- Method: `GET`
- Endpoint: `/api/books/book_copies/count/{id}`
- What it does: Returns the number of copies available in the system for a book ID.

Example: `/api/books/book_copies/count/1`

Sample response:

```json
{
  "success": true,
  "message": "success",
  "data": 3
}
```

## Librarian APIs

### 14. Create Member

- Method: `POST`
- Endpoint: `/lib/member/create`
- What it does: Creates a library member.

Sample request:

```json
{
  "name": "Amit Verma"
}
```

Sample response:

```json
{
  "success": true,
  "message": "created",
  "data": {
    "memberID": 1,
    "name": "Amit Verma",
    "createdAt": "2026-03-23T10:25:10.123456"
  }
}
```

### 15. Get All Members

- Method: `GET`
- Endpoint: `/lib/member/getAll`
- What it does: Returns all members.

Sample response:

```json
{
  "success": true,
  "message": "fetched",
  "data": [
    {
      "memberID": 1,
      "name": "Amit Verma",
      "createdAt": "2026-03-23T10:25:10.123456"
    }
  ]
}
```

### 16. Get Member By ID

- Method: `GET`
- Endpoint: `/lib/member/{id}`
- What it does: Returns one member by ID.

Example: `/lib/member/1`

Sample response:

```json
{
  "success": true,
  "message": "fetched",
  "data": {
    "memberID": 1,
    "name": "Amit Verma",
    "createdAt": "2026-03-23T10:25:10.123456"
  }
}
```

### 17. Delete Member

- Method: `DELETE`
- Endpoint: `/lib/member/delete/{id}`
- What it does: Deletes a member by ID.

Example: `/lib/member/delete/1`

Sample response:

```json
{
  "success": true,
  "message": "deleted",
  "data": true
}
```

### 18. Issue Book Copy

- Method: `POST`
- Endpoint: `/lib/issue`
- What it does: Issues a book copy to a member. The copy must not already be issued.

Sample request:

```json
{
  "memberID": 1,
  "bookCopyID": 1
}
```

Sample response:

```json
{
  "success": true,
  "message": "issued",
  "data": {
    "issueId": 1,
    "bookCopyId": 1,
    "bookId": 1,
    "bookName": "Clean Code",
    "memberId": 1,
    "memberName": "Amit Verma",
    "issuedAt": "2026-03-23T10:30:00.000000",
    "status": "issued"
  }
}
```

### 19. Return Book Copy

- Method: `POST`
- Endpoint: `/lib/return/{id}`
- What it does: Marks a book copy as returned and closes the latest active issue transaction for that copy.

Example: `/lib/return/1`

Sample response:

```json
{
  "success": true,
  "message": "returned",
  "data": {
    "issueId": 1,
    "bookCopyId": 1,
    "bookId": 1,
    "bookName": "Clean Code",
    "memberId": 1,
    "memberName": "Amit Verma",
    "issuedAt": "2026-03-23T10:30:00.000000",
    "status": "returned"
  }
}
```

### 20. Calculate Fine

- Method: `GET`
- Endpoint: `/lib/calculateFine/{id}`
- What it does: Calculates fine for the latest returned transaction of a book copy. If fine was already calculated earlier, the stored amount is returned.

Example: `/lib/calculateFine/1`

Sample response:

```json
{
  "success": true,
  "message": "fine calculated",
  "data": 20.0
}
```

## Common Error Examples

### Duplicate ISBN

Request:

- Method: `POST`
- Endpoint: `/api/books/add`

Response:

```json
{
  "success": false,
  "message": "An unexpected error occurred: Book with ISBN 9780132350884 already  exists.",
  "data": null
}
```

### Invalid Login

Request:

- Method: `POST`
- Endpoint: `/api/admin/login`

Response:

```json
{
  "success": false,
  "message": "An unexpected error occurred: Invalid credentials",
  "data": null
}
```

### Book Copy Already Issued

Request:

- Method: `POST`
- Endpoint: `/lib/issue`

Response:

```json
{
  "success": false,
  "message": "An unexpected error occurred: Book already issued",
  "data": null
}
```

## Notes

- The configured application port is `8080`, so local API base URL is `http://localhost:8080`.
- H2 console is enabled at `http://localhost:8080/h2-console`.
- There is no authentication token flow in the current implementation. Login only validates credentials and returns staff details.
- Most validation, not-found, and business-rule failures currently return HTTP `500` because of the global exception handler.
