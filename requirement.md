# TASKFLOW — PROJECT REQUIREMENTS

Version: 1.0
Project type: Full-stack project management SaaS dashboard
Primary goal: Build a polished, deployable portfolio project for frontend/full-stack developer job applications.

1. PROJECT OVERVIEW

---

TaskFlow is a responsive web application that lets an authenticated user create and manage projects and tasks, organize work by status and priority, track due dates, and view a dashboard summarizing progress.

The first release is a single-user workspace: each user manages their own projects and tasks. Real-time collaboration, team invitations, chat, payments, file uploads, and notifications are explicitly out of scope for version 1.

2. TARGET USERS

---

- Individuals who want to organize personal or professional projects.
- Recruiters and interviewers evaluating the developer's frontend, API, database, authentication, validation, testing, and deployment skills.

3. TECHNOLOGY STACK

---

- Framework: Next.js App Router with TypeScript.
- UI: React, Tailwind CSS, and shadcn/ui components where useful.
- Authentication: Clerk (or another established authentication provider if Clerk is unavailable).
- Database: MongoDB Atlas.
- Data modeling: Mongoose.
- Request validation: Zod or an equivalent schema validation library.
- Charts: Recharts.
- Testing: Vitest for unit tests and an appropriate integration or end-to-end test tool if time permits.
- Deployment: Vercel for the application and MongoDB Atlas for the database.
- Version control: Git and GitHub.

Use Next.js Route Handlers for server-side API operations in version 1. A separate Express server is not required.

4. VERSION 1 SCOPE

---

MUST HAVE

- Responsive dashboard and application layout.
- Sign-in/sign-out and protected application routes.
- Create, read, update, and delete projects.
- Create, read, update, and delete tasks.
- Task status, priority, due date, and project association.
- Task search, filtering, and sorting.
- Dashboard metrics calculated from the user's actual stored records.
- At least one useful chart based on task data.
- Server-side input validation and useful error messages.
- Server-side authorization and user-level data isolation.
- Loading, empty, success, and error states.
- Production deployment and a useful README.

SHOULD HAVE

- A confirmation dialog before deleting a project or task.
- Pagination or a reasonable display limit if lists become large.
- Accessible labels, keyboard-friendly forms, and visible focus states.
- Unit tests for analytics calculations and validation logic.
- A custom not-found page and a friendly error page.

OUT OF SCOPE FOR VERSION 1

- Real-time updates and WebSockets.
- Team workspaces, invitations, and shared projects.
- Chat, comments, activity feeds, and notifications.
- Payments or subscriptions.
- File and image uploads.
- Mobile native apps.
- Complex role-based permissions beyond user ownership.

5. APPLICATION PAGES

---

5.1 Public / Sign-in

- Show TaskFlow branding and a clear sign-in action.
- Allow users to authenticate using the configured provider.
- Redirect authenticated users to the dashboard.

  5.2 Dashboard (/dashboard)

- Display summary cards for active projects, open tasks, completed tasks or completion rate, and overdue tasks.
- Show a chart for task status or task completion over time.
- Show a short list of recently updated or upcoming tasks.
- Provide links to create a project or task.
- Compute metrics from the current user's records; do not hard-code dashboard totals.

  5.3 Projects (/projects)

- List the current user's projects.
- Show each project's name, short description, task counts, and progress where practical.
- Include create, edit, view, and delete actions.
- Include an understandable empty state when no projects exist.

  5.4 Project details (/projects/[projectId])

- Display project details and tasks belonging to that project.
- Support editing project details.
- Allow creating tasks directly inside the project.
- Do not expose a project or its tasks to a different user.

  5.5 Tasks (/tasks)

- Display the current user's tasks in a readable list or table.
- Show title, project, status, priority, and due date.
- Support search, status/priority filtering, and sorting by due date or recent update.
- Provide create, edit, status-update, and delete actions.
- Clearly distinguish overdue tasks.

  5.6 Settings / Profile (basic)

- Display basic authenticated-user information where available.
- Provide a sign-out action.
- Do not store authentication passwords in the application's own database.

6. FUNCTIONAL REQUIREMENTS

---

FR-01 Authentication

- Unauthenticated users must not access protected dashboard, project, task, or settings data.
- Authenticated users can sign out.
- Every protected server operation must identify the authenticated user from a trusted server-side session or token.

FR-02 Project management

- Users can create a project with a required name and an optional description.
- Users can view and update their own projects.
- Users can delete their own projects after confirming the action.
- When a project is deleted, its tasks must be deleted too or handled by a clearly documented alternative. Recommended MVP behavior: delete the project's tasks in the same controlled server operation.
- Project names must be trimmed and validated.

FR-03 Task management

- Users can create a task with a required title.
- A task may optionally belong to a project; if a project is provided, it must belong to the same authenticated user.
- Users can update a task's title, description, status, priority, due date, and project association.
- Users can delete their own tasks.
- Valid statuses: TODO, IN_PROGRESS, DONE.
- Valid priorities: LOW, MEDIUM, HIGH.
- Due dates are optional and must be stored/handled consistently.

FR-04 Search, filtering, and sorting

- Search should match task titles and, where practical, descriptions.
- Users can filter by status and priority.
- Users can filter by project where appropriate.
- Users can sort by due date and last-updated time.
- Filters should be combinable and should show a helpful message when no results match.

FR-05 Analytics

- Active projects = the user's projects that are not archived, if archiving is implemented; otherwise, all existing projects.
- Open tasks = tasks whose status is not DONE.
- Completed tasks = tasks whose status is DONE.
- Overdue tasks = tasks with a due date before the current date and status not DONE.
- Completion rate = completed tasks divided by total tasks, multiplied by 100. If there are no tasks, show 0% rather than NaN or an error.
- Charts must use actual database-backed task records. If the app has no records, show an empty chart state or a clear zero-data message.

FR-06 Validation and error handling

- Validate every submitted payload on the server, even if the UI also validates it.
- Reject invalid IDs, unsupported status/priority values, missing required fields, and invalid dates.
- Return appropriate HTTP status codes and clear, non-sensitive error messages.
- Never return database credentials, stack traces, tokens, or other secrets to the browser.

FR-07 Data ownership and authorization

- Every database query for user-owned data must be scoped to the authenticated user's ID.
- A user must not read, update, or delete another user's projects or tasks by changing an ID in a URL or API request.
- When linking a task to a project, verify ownership of that project on the server.
- UI hiding alone does not count as authorization.

7. DATA MODEL REQUIREMENTS

---

User identity

- Use the authentication provider's stable user ID as the owner reference.
- Keep only profile information the application actually needs.
- Do not store passwords or authentication secrets.

Project document (suggested fields)

- \_id: MongoDB document ID.
- ownerId: required authentication-provider user ID.
- name: required string, trimmed, reasonable maximum length (for example 100 characters).
- description: optional string, reasonable maximum length (for example 1,000 characters).
- createdAt: timestamp.
- updatedAt: timestamp.

Task document (suggested fields)

- \_id: MongoDB document ID.
- ownerId: required authentication-provider user ID.
- projectId: optional reference to a Project.
- title: required string, trimmed, reasonable maximum length (for example 150 characters).
- description: optional string, reasonable maximum length (for example 2,000 characters).
- status: TODO, IN_PROGRESS, or DONE; default TODO.
- priority: LOW, MEDIUM, or HIGH; default MEDIUM.
- dueDate: optional date.
- createdAt: timestamp.
- updatedAt: timestamp.

Implementation notes

- Enable timestamps on Mongoose schemas.
- Add indexes for commonly queried fields where useful, such as ownerId, projectId, status, and dueDate.
- Avoid trusting ownerId supplied by the client. Set it from the authenticated server-side identity.
- Validate that projectId refers to an existing project owned by the current user.

8. API / ROUTE HANDLER REQUIREMENTS

---

Use Next.js Route Handlers under app/api. Exact URL naming may be adjusted, but behavior should remain equivalent.

Projects

- GET /api/projects — list the current user's projects.
- POST /api/projects — create a project.
- GET /api/projects/[projectId] — fetch one owned project.
- PATCH /api/projects/[projectId] — update an owned project.
- DELETE /api/projects/[projectId] — delete an owned project and handle its tasks consistently.

Tasks

- GET /api/tasks — list the current user's tasks; support query parameters for search, status, priority, project, sort, and pagination if implemented.
- POST /api/tasks — create a task.
- GET /api/tasks/[taskId] — fetch one owned task.
- PATCH /api/tasks/[taskId] — update an owned task.
- DELETE /api/tasks/[taskId] — delete an owned task.

Dashboard

- GET /api/dashboard/summary — return the current user's summary metrics and chart data, or calculate them safely on the server.

For every endpoint:

- Authenticate before accessing private data.
- Validate route IDs and request bodies.
- Scope reads and mutations to the authenticated user's ownerId.
- Return predictable JSON shapes and suitable HTTP status codes.
- Handle database connection failures gracefully.

9. USER INTERFACE AND UX REQUIREMENTS

---

- Use a consistent sidebar/header layout on desktop and a usable navigation pattern on mobile.
- Ensure forms work on narrow screens and do not overflow horizontally.
- Use consistent spacing, typography, colors, button styles, badges, and form controls.
- Display visible feedback after successful create/update/delete operations.
- Disable or indicate a submit action while it is processing to reduce accidental duplicate submissions.
- Prevent repeated submissions where practical.
- Include loading states while data is being fetched.
- Include empty states with a clear next action.
- Include friendly error states with a retry option where appropriate.
- Use confirmation before destructive actions.
- Provide labels and accessible names for inputs and icon-only buttons.
- Ensure important actions can be reached and operated with a keyboard.
- Do not use invented metrics as if they came from real user data.

10. SECURITY AND CONFIGURATION

---

- Keep secrets in environment variables; never commit .env files.
- Provide a .env.example containing variable names and placeholder values only.
- Use the authentication provider's recommended server-side verification patterns.
- Validate and authorize all writes and reads on the server.
- Do not accept ownerId from the request body as proof of ownership.
- Do not expose the MongoDB connection string to client-side code.
- Use HTTPS in production through the deployment platform.
- Restrict production database credentials and permissions to what the app requires.
- Avoid logging session tokens or sensitive personal information.

Suggested environment variable names (provider-specific names may differ)

- MONGODB_URI=
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
- CLERK_SECRET_KEY=
- NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
- NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

Never place secret keys in NEXT*PUBLIC* variables. Follow the current authentication provider documentation for exact variable names and configuration.

11. TESTING REQUIREMENTS

---

At minimum, manually verify all major features before deployment. Add automated tests for important calculations and validation where possible.

Test cases

- Completion rate is 0% when there are no tasks.
- Completion rate is correct when some tasks are complete.
- A DONE task is not counted as open or overdue.
- An overdue, incomplete task is counted as overdue.
- Invalid status, priority, title, and date values are rejected.
- An unauthenticated request cannot access private data.
- User A cannot read, update, or delete User B's project or task using a guessed or copied ID.
- A task cannot be attached to another user's project.
- Deleting a project handles its related tasks according to the documented rule.
- Search, filtering, sorting, create, edit, and delete flows work as expected.
- The application handles empty data and database/API errors without crashing.
- The production deployment works on desktop and mobile-sized screens.

12. ACCEPTANCE CRITERIA

---

The MVP is considered complete when:

- A new user can sign in and reach the dashboard.
- The user can create a project and create tasks associated with it.
- The user can edit, update status, search, filter, sort, and delete tasks.
- Dashboard metrics and charts reflect the saved data accurately.
- User-specific data is protected by server-side authorization.
- Forms validate inputs and display understandable errors.
- Loading, empty, and destructive-action states are implemented.
- Core pages are responsive and keyboard-usable.
- Important calculations and access-control behavior have been tested.
- The app is deployed and has been tested in its production environment.
- The GitHub README includes project overview, feature list, stack, setup steps, environment variable guidance, screenshots, live demo link, and known limitations.
- No credentials, tokens, or real secrets are committed to Git.

13. DEVELOPMENT PLAN

---

Phase 1 — Refresh and setup

- Review TypeScript, React state/forms, and Next.js App Router.
- Create repository, scaffold the app, configure linting/formatting, and build the basic layout.

Phase 2 — Frontend with mock data

- Build dashboard, project pages, task list, forms, and reusable UI components.
- Verify responsive layouts before integrating the database.

Phase 3 — Database and CRUD

- Connect MongoDB Atlas.
- Create Mongoose schemas.
- Implement and test project/task route handlers.

Phase 4 — Authentication and authorization

- Integrate authentication.
- Protect pages and APIs.
- Enforce owner-scoped data access on every protected operation.

Phase 5 — Search and analytics

- Add filters and sorting.
- Calculate metrics from saved records.
- Add chart(s) and empty-data behavior.

Phase 6 — Quality and deployment

- Test core flows, validation, security, responsiveness, and production configuration.
- Deploy, write README, add screenshots, and prepare a short demo.

14. PROJECT GUIDELINES

---

- Build the smallest complete version first; add optional features only after the MVP works.
- Commit working changes to Git regularly with clear commit messages.
- Prefer readable, reusable components and straightforward code over premature abstraction.
- Do not add real-time collaboration, payments, or team permissions during the MVP.
- Do not claim a feature is complete until it has been tested.
- Keep the live demo, repository, and README in sync.

END OF REQUIREMENTS
