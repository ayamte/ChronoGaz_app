Auth API Resources
All the authentication routes follow /api/auth/


| #   | Routers                     | Verbs  | Progress | Is Private | Description                                            |
| --- | --------------------------- | ------ | -------- | ---------- | ------------------------------------------------------ |
| 1   | `/api/auth/register`        | POST   | DONE     | No         | Register a new client account                          |
| 2   | `/api/auth/login`           | POST   | DONE     | No         | Log in with email and password, return tokens          |
| 3   | `/api/auth/logout`          | POST   | NotD     | Yes        | Invalidate the refresh token (logout)                  |
| 4   | `/api/auth/refresh`         | POST   | NotD     | No         | Get new access token using refresh token               |
| 5   | `/api/auth/forgot-password` | POST   | NotD     | No         | Send reset password link or code to user email         |
| 6   | `/api/auth/reset-password`  | POST   | NotD     | No         | Reset user password using token or verification process|



| #   | Routers                 | Verbs  | Progress | Is Private  | Description                                   |
| --- | ------------------------|--------|----------|-------------|-----------------------------------------------|
| 1   | `/api/users/profile`    | GET    | DONE     | Yes         | Get the profile of the logged-in user         |
| 2   | `/api/users/profile`    | PUT    | DONE     | Yes         | Update the profile of the logged-in user      |
| 3   | `/api/users`            | GET    | DONE     | Yes (Admin) | Get the list of all users                     |
| 4   | `/api/users`            | POST   | NotD     | Yes         | Create a new user (Admin)                     |
| 5   | `/api/users/:id`        | PUT    | DONE     | Yes (Admin) | Update a user by ID                           |
| 6   | `/api/users/:id`        | DELETE | DONE     | Yes (Admin) | Delete a user by ID                           |
