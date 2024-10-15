🎛️ SORTED RACK - IT Asset Management and Ticketing System
============================================

📋 Overview
-----------

The **SORTED RACK** is a comprehensive solution designed to streamline the management of IT assets and support tickets within organizations. It empowers teams to efficiently track IT equipment, assign devices, manage users, and handle support tickets---all in one place.

Demo Link: https://vimeo.com/1019677195?share=copy
🚀 Features
-----------

-   👥 **User Management**: Administer users with role-based permissions.
-   💻 **Asset Management**: Track and manage IT assets (systems and accessories).
-   🖥️ **Device Assignment**: Easily assign and track devices allocated to users.
-   🛠️ **Ticket Creation and Management**: Log and manage IT support tickets effortlessly.
-   🔐 **Role-based Access Control**: Assign specific roles like admin or user for access control.

* * * * *

🛠️ Technologies Used
---------------------

| Technology | Description |
| --- | --- |
| **Frontend** | React.js |
| **Backend** | Node.js with Express.js |
| **Database** | MongoDB |
| **Authentication** | JSON Web Tokens (JWT) |
| **UI Libraries** | React Bootstrap, Ant Design |

* * * * *

⚙️ Installation
---------------

### Prerequisites

Before running the project, ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (v14 or later)
-   [MongoDB](https://www.mongodb.com/)
-   [Git](https://git-scm.com/)

### Setup Steps

1.  **Clone the Repository**:


    `
    git clone https://github.com/AbhijitSarker/sorted-rack.git
    `

2.  **Install Dependencies**:

    -   For the **frontend**:

        `cd frontend
        npm install`

    -   For the **backend**:

        `cd ../backend
        npm install`

3.  **Configure Environment Variables**: Create a `.env` file in the `backend` directory with the following values:

    `PORT=4000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret`

4.  **Start the Backend Server**:


    `cd backend
    npm start`

5.  **Start the Frontend Development Server**:

    `cd frontend
    npm start`

6.  **Open the Application**: Navigate to `http://localhost:3000` in your browser.
