# Hello Rotaract - Backend Handoff & Architecture Guide

Welcome to the **Hello Rotaract** backend handoff documentation. This document outlines the existing data structures (currently mocked in the frontend using LocalStorage) and the microservices logic that the backend team needs to replicate using a real database (e.g., PostgreSQL, MongoDB, or MySQL) and a server environment (e.g., Node.js/Express, Python/Django).

## 1. Database Schema Definitions

The current application relies on the following core entities. Please translate these into your chosen database schema.

### 1.1 Users (`hr_users`)
Handles authentication, authorization, and core identity.
- `id`: String (UUID) - Primary Key
- `email`: String (Unique)
- `phone`: String
- `passwordHash`: String (Bcrypt/Argon2 recommended)
- `role`: Enum (`ADMIN`, `TREASURER`, `MEMBER`)
- `status`: Enum (`APPROVED`, `PENDING_APPROVAL`, `REJECTED`)
- `emailVerified`: Boolean

### 1.2 Profiles (`hr_profiles`)
Stores Rotaract-specific public profile data tied to a User.
- `id`: String (UUID) - Primary Key
- `userId`: String (Foreign Key -> Users.id)
- `name`: String
- `rotaractId`: String (e.g., RID-9901)
- `clubId`: String
- `clubName`: String
- `parentRotary`: String
- `district`: String
- `isBOD`: Boolean (Board of Directors flag)
- `avatarUrl`: String (URL)

### 1.3 Payments & Dues (`hr_payments`)
Tracks membership fees and other financial contributions.
- `id`: String (UUID) - Primary Key
- `profileId`: String (Foreign Key -> Profiles.id)
- `amountDue`: Number
- `status`: Enum (`PAID`, `UNPAID`, `PENDING_VERIFICATION`)
- `upiTransactionRef`: String (Null if unpaid)
- `receiptScreenshotUrl`: String (Null if unpaid)
- `remarks`: String
- `verifiedBy`: String (Foreign Key -> Profiles.id) (Null if unverified)
- `verifiedAt`: DateTime
- `createdAt`: DateTime

### 1.4 Events (`hr_events`)
Stores club events, meetings, and activities.
- `id`: String (UUID) - Primary Key
- `title`: String
- `description`: Text
- `startTime`: DateTime
- `endTime`: DateTime
- `venue`: String
- `tag`: Enum (`Ceremony`, `Community Service`, `Professional Dev`, etc.)
- `googleRulebookUrl`: String (URL)
- `meetLink`: String (URL)
- `coordinators`: Array of Strings (Foreign Keys -> Profiles.id)
- `createdBy`: String (Foreign Key -> Profiles.id)

### 1.5 Tasks (`hr_tasks`)
Administrative and member-assigned tasks.
- `id`: String (UUID) - Primary Key
- `title`: String
- `description`: Text
- `assignedTo`: String (Foreign Key -> Profiles.id) (Can be null)
- `createdBy`: String (Foreign Key -> Profiles.id)
- `startDate`: DateTime
- `endDate`: DateTime
- `status`: Enum (`PENDING`, `IN_PROGRESS`, `COMPLETED`)

### 1.6 Notices (`hr_notices`)
Club-wide announcements sent by Admins.
- `id`: String (UUID) - Primary Key
- `title`: String
- `content`: Text
- `createdBy`: String (Foreign Key -> Profiles.id)
- `createdAt`: DateTime

### 1.7 Attendance (`hr_attendance`)
Tracks presence at events.
- `id`: String (UUID) - Primary Key (Optional if composite key used)
- `eventId`: String (Foreign Key -> Events.id)
- `profileId`: String (Foreign Key -> Profiles.id)
- `attendedByAdminId`: String (Foreign Key -> Profiles.id)
- `attendedAt`: DateTime

### 1.8 Notifications (`hr_notifications`)
In-app alerts for users.
- `id`: String (UUID) - Primary Key
- `profileId`: String (Foreign Key -> Profiles.id)
- `title`: String
- `content`: Text
- `read`: Boolean (Default: false)
- `createdAt`: DateTime

---

## 2. Recommended API Endpoints

The frontend expects standard RESTful APIs or GraphQL endpoints. Here is a recommended structure for the REST APIs:

### Authentication & Onboarding
- `POST /api/auth/login` - Authenticates user and returns JWT token + Profile data.
- `POST /api/auth/register/initiate` - Initiates registration, sends OTP.
- `POST /api/auth/register/complete` - Completes registration, maps against pre-approved list (`preApprovedMembers`), sets status to `APPROVED` or `PENDING_APPROVAL`.
- `GET /api/admin/approvals` - Fetch users pending admin approval.
- `POST /api/admin/approve` - Admin approves or rejects onboarding requests.

### Dues & Payments (Treasurer & Member)
- `GET /api/payments/me` - Fetch logged-in user's payment dues.
- `POST /api/payments/submit` - Member submits UPI reference ID and screenshot URL (Status -> `PENDING_VERIFICATION`).
- `GET /api/payments/pending` - Treasurer fetches pending payment proofs.
- `POST /api/payments/verify` - Treasurer approves (`PAID`) or rejects (`UNPAID` + remarks) payment proofs.

### Events & Attendance
- `GET /api/events` - Fetch all events.
- `POST /api/events` - Admin creates new event.
- `POST /api/events/:eventId/attendance` - Admin logs attendance for a member.
- `DELETE /api/events/:eventId/attendance/:profileId` - Admin removes attendance.
- `GET /api/events/:eventId/attendance` - Fetch attendance list for an event.

### Tasks & Notices
- `GET /api/tasks` - Fetch tasks created by or assigned to the user.
- `POST /api/tasks` - Create a new task.
- `PATCH /api/tasks/:taskId/status` - Toggle task status (e.g., COMPLETED).
- `DELETE /api/tasks/:taskId` - Delete a self-logged task.
- `GET /api/notices` - Fetch all notices.
- `POST /api/notices` - Admin sends a new notice (triggers notifications).

### Notifications
- `GET /api/notifications` - Fetch user's notifications.
- `PATCH /api/notifications/read` - Mark all notifications as read.

---

## 3. Final Production Build Instructions

The frontend is built using **Vite + React**. 

### Preparing the Frontend for Production
Once the backend APIs are live, the frontend code needs to be updated to make HTTP requests instead of using the `mockDb.js` LocalStorage simulation.
1. Create an `.env.production` file in the frontend root and set your API base URL:
   ```env
   VITE_API_BASE_URL=https://api.yourproductiondomain.com
   ```
2. Replace the simulated service calls in `src/data/mockDb.js` (or replace the file entirely) with actual `fetch` or `axios` calls pointing to `import.meta.env.VITE_API_BASE_URL`.

### Running the Build Command
To generate the optimized static bundle for deployment:
1. Ensure all dependencies are installed:
   ```bash
   npm install
   ```
2. Run the build command:
   ```bash
   npm run build
   ```
3. The built static files will be placed inside the `/dist` directory.

### Deployment Recommendations
- **Frontend**: The contents of the `/dist` folder can be hosted on Vercel, Netlify, AWS S3 + CloudFront, or any static file server.
- **Backend**: Ensure your server implements **CORS** allowing requests from the frontend domain.
- **Media Storage**: For `avatarUrl` and `receiptScreenshotUrl`, it is highly recommended to implement AWS S3, Cloudinary, or Firebase Storage to handle image uploads, rather than storing base64 strings in the database.

---
**Note:** The pre-approved member logic is currently hardcoded in the frontend `mockDb.js`. The backend team should migrate this logic into an admin-managed database table (e.g., `hr_club_roster`) so the club president/admin can upload Excel sheets of pre-approved members dynamically.
