# **X-Chat**  

[![Actions Status](https://github.com/IKS26/frontend-project-12/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/IKS26/frontend-project-12/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/c81b09736b3d08ab3df3/maintainability)](https://codeclimate.com/github/IKS26/frontend-project-12/maintainability)

## **About the Project**  
**X-Chat** is a real-time chat application built using modern web technologies. It demonstrates front-end development best practices, including:  

✅ **Real-time Messaging** – WebSockets for instant communication  
✅ **JWT Authentication** – Secure user login system  
✅ **State Management** – Redux Toolkit for efficient state control  
✅ **Internationalization** – Multiple language support (default: Russian)  
✅ **Form Validation** – Formik & Yup for better UX  
✅ **Error Handling** – Rollbar integration for production monitoring  
✅ **Responsive UI** – Built with React & Bootstrap  

This project showcases how to build a scalable chat app with WebSockets, authentication, and dynamic channel management.  

## **Live Demo**  
Try the deployed application here: **[X-Chat on Render](https://x-chat-app-r9cv.onrender.com)**  

---

## **Installation & Setup**  

### **1. Clone the Repository**  
First, clone the project and navigate to its directory:  
```sh
git clone git@github.com:IKS26/frontend-project-12.git
cd frontend-project-12
```

---

## **Setting Up for Development**  

### **2. Install Dependencies**  
Install all required dependencies:  
```sh
make install
```

### **3. Start the Backend Server**  
Run the backend server (if not already running):  
```sh
make start
```

### **4. Start the Development Server**  
Launch the application in development mode:  
```sh
make dev
```
The application will be available at `http://localhost:5002/` (or another available port).  

---

## **Building for Deployment**  

### **5. Create a Production Build**  
To generate an optimized production-ready version of the application, run:  
```sh
make build
```

### **6. Start the Production Server**  
After building the application, start the production server:  
```sh
make start
```

This will serve the built files in a production environment.  

---

## **Tech Stack**

### **Frontend**

- **React** – UI framework
- **Redux Toolkit** – State management
- **RTK Query** – Efficient data fetching and caching
- **React Router** – Client-side navigation
- **Axios** – API requests
- **Socket.IO** – WebSockets for real-time updates
- **Formik + Yup** – Form validation
- **react-toastify** – User notifications
- **react-i18next** – Internationalization

### **Backend**

- **Framework**: Fastify – a lightweight and high-performance web framework for Node.js.

**Features**:
- **Real-time communication** – Socket.IO for WebSockets.
- **Authentication** – JWT (JSON Web Tokens) for user authentication.
- **Static Files** – Serving static assets.

**Port**: `5001`

### **Deployment & Monitoring**

- **Render** – PaaS for hosting
- **Rollbar** – Error tracking

---

## **Features Overview**

### **Authentication**

- Secure login with JWT
- Token stored in `localStorage`
- Redirects unauthorized users to `/login`

### **Chat Functionality**

- Displays a list of available channels
- Supports real-time messaging via WebSockets
- Messages persist in the Redux store

### **Channel Management**

- Users can create, rename, and delete channels
- Channel names must be unique (3–20 characters)
- Users are redirected to newly created channels

### **Form Handling**

- Uses **Formik** for form management
- Validation powered by **Yup**

### **Internationalization**

- Uses **react-i18next** to manage translations
- Default language: **Russian** (`ru`)

### **Error Tracking & Notifications**

- **React-Toastify** for user notifications
- **Rollbar** for monitoring errors in production

---
## **Contributing**

Contributions are welcome! Please follow these steps:

1. **Fork** the repository.
2. **Create a new branch** (`feature-name`).
3. **Commit** your changes with descriptive messages.
4. **Submit a pull request**.

---

## **License**

MIT License. See [LICENSE](LICENSE) for details.
