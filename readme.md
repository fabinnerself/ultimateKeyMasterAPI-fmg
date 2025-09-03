# Ultimate Key Master API

The API is built using the following technologies:
- Node.js
- TypeScript
- TypeORM
- dotenv
- environment variables
- Postman

 #🔗Routes The following resource is available:

 https://ultimatekeymasterapi-fmg.onrender.com 

Is designed to manage users, security boxes, credential storage, and PINs while providing full CRUD operations with data validations and security features. The API ensures secure user authentication, encrypted password handling, allowing users to manage their accounts, security boxes, credentials, and PINs with confidence. To enhance data integrity, users can only soft delete their own accounts and associated resources, ensuring that critical information remains recoverable while maintaining privacy and security standards 

---

## Endpoints Documentation

### Users

#### **GET** Retrieve User by ID

**Endpoint:**
```
GET /api/v1/users/:id
```

**Description:**
Retrieves detailed information about a specific user based on the provided ID. The response includes the user’s name, email, role, and status. Passwords are excluded for security purposes.

**Example Request:**
```bash
curl --location 'localhost:3000/api/v1/users/b7769db4-cd32-4bb8-90af-5ace557e1eed'
```

**Example Response:**
```json
{
  "id": "b7769db4-cd32-4bb8-90af-5ace557e1eed",
  "name": "fernando",
  "email": "fer@a.net",
  "password": "1234",
  "status": "available",
  "role": "client"
}
```

---

#### **PATCH** Update User Details

**Endpoint:**
```
PATCH /api/v1/users/:id
```

**Description:**
Updates the information of an existing user. Fields such as `name` and `email` can be updated. The request ensures all provided data is valid and complete before updating the database.

**Example Request:**
```bash
curl --location --request PATCH 'localhost:3000/api/v1/users/9556aec9-7316-48e3-96f2-1d78456735b1' \
--data-raw '{"name":"sebastian mod1","email":"sebas@a.net mod1"}'
```

**Example Response (Error):**
```json
{
  "message": "Something went very wrong! 🧨"
}
```

---

#### **DELETE** Soft Delete User

**Endpoint:**
```
DELETE /api/v1/users/:id
```

**Description:**
Performs a logical deletion by changing the user’s status to `disabled`. The operation is irreversible and should be done with caution. The ID must be provided in the URL.

**Example Request:**
```bash
curl --location --request DELETE 'localhost:3000/api/v1/users/1'
```

**Example Response (Error):**
```json
{
  "error": "Missing ID parameter. Please provide a user ID in the URL.",
  "example": "/api/v1/users/:id"
}
```

---

## Features
- Full CRUD operations for users and repairs.
- User verification during creation.
- Repair status validation to prevent invalid transitions.
- Detailed error handling and informative responses.

## Getting Started

### Prerequisites
- Node.js
- TypeScript
- TypeORM

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/fabinnerself/ultimateKeyMasterAPI-fmg.git
   ```
2. Navigate to the project directory:
   ```bash
   cd ultimateKeyMasterAPI-fmg/
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment variables in `.env`.

### Running the Server
```bash
npm run dev
```

---


## Additional Documentation
A detailed Postman collection documenting the API endpoints is available at the following link: [Postman Documentation](https://documenter.getpostman.com/view/22674808/2sAYX9mfGQ).


## Contributing
Contributions are welcome! Please submit a pull request or open an issue to report bugs or suggest new features.

---

## License
This project is licensed under the [MIT License](LICENSE).
