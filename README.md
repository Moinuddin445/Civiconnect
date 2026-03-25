# CivicConnect 

CivicConnect is a modern community engagement platform designed to streamline the reporting and resolution of public issues (complaints). It facilitates seamless communication between citizens, government officers, and administrators.

##  Key Features

### Citizen Portal
- **Secure Authentication**: Register and log in as a citizen.
- **Complaint Submission**: Easy-to-use form to report issues with category selection and optional image attachments.
- **Location Support**: Attach geographical coordinates to complaints for precise targeting.
- **Tracking History**: Real-time tracking of complaint status and historical updates.

###  Officer Portal
- **Personal Dashboard**: View all tasks assigned by administrators.
- **Status Management**: Update complaints to 'In Progress', 'Resolved', or 'Closed'.
- **Field Remarks**: Add processing remarks that citizens can see in real-time.
- **Visual Evidence**: View images uploaded by citizens to understand the issue better.

###  Admin Dashboard
- **Comprehensive Analytics**: High-level overview of total, pending, and resolved issues.
- **Officer Assignment**: Delegate incoming complaints to specific field officers.
- **User Management**: Unified view of all registered Citizens, Officers, and Admins.
- **System Control**: Delete users or manage profiles as needed.

---

##  Technology Stack

### **Frontend**
- **React 18** (Vite-based)
- **Tailwind CSS** (Premium styling & responsive design)
- **Lucide React** (Modern iconography)
- **Axios** (Robust API communication)
- **React Router 6** (Role-based secure routing)

### **Backend**
- **Java 17 / Spring Boot 3**
- **Spring Security & JWT** (Stateless authentication)
- **MySQL** (Relational database)
- **ModelMapper** (DTO-Entity mapping)
- **RESTful API** (Clean endpoint structure)

---

##  Setup & Installation

### **Prerequisites**
- Node.js (v18+)
- Java JDK 17
- MySQL Server

### **1. Backend Configuration**
1. Navigate to the `backend` directory.
2. Open `src/main/resources/application.properties`.
3. Update the database credentials (`spring.datasource.username` and `spring.datasource.password`).
4. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

### **2. Frontend Configuration**
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the app at `http://localhost:5173`.

---

##  Default User Roles
- **ROLE_CITIZEN**: General public user.
- **ROLE_OFFICER**: Field staff responsible for resolving issues.
- **ROLE_ADMIN**: System administrator managing assignments and users.

---

##  License
This project is for educational/internal use within the CivicConnect ecosystem.
