# Foodiv App v3

## Overview
**Foodiv App v3** is a food ordering and recipe management application built using the **MERN stack**. The app includes an **admin panel** for managing categories, recipes, and other content. 

## Key Features
### User Interface
- Browse food categories (Appetizers, Main Courses, Desserts, etc.).
- View detailed recipes with ingredients and pricing.
- Responsive design using **React Bootstrap**.

### Admin Panel
- **Authentication**: Admin login 
- **Category Management**: Add, update, and delete food categories with images.
- **Recipe Management**: Add and update recipes with name, category, ingredients, price, and images.

### User Registration
- **Sign Up & Login**: Users can create an account to explore the platform.
- **Authentication**: Secure login system with Firebase Authentication.

### Order Management
- **Cart System**: Users can add multiple items to their cart before checkout.
- **Order Tracking**: Track orders and receive status updates.
- **Email Notifications**: Order confirmations sent via Nodemailer.

### Payment Integration
- **Secure Payments**: Integration with payment gateways for hassle-free transactions.

### Cloud Storage
- **Cloudinary Integration**: Efficient image storage and retrieval for recipes and categories.

### Data Optimization
- **MongoDB Indexing**: Optimized database queries for faster access.
- **Scheduled Cleanup**: Regularly archive old order records to maintain performance.

## Technologies Used
### Backend API
- Developed using **Node.js** and **Express.js**.
- Uses **MongoDB** for database storage.
- Secure API communication with **JWT authentication**.

### Frontend
- Built with **React, Vite, and Redux Toolkit**.
- UI components styled using **React Bootstrap**.

### Database
- Utilizes **MongoDB with Mongoose ORM**.
- Implements structured relationships between users, orders, and recipes.

### Security
- Sensitive information is secured using **environment variables**.
- Admin authentication is handled via **Firebase Authentication**.

## Installation
### Prerequisites
Ensure you have the following installed:
- **Node.js** (Latest LTS version recommended)
- **MongoDB** (Locally or via MongoDB Atlas)


### Steps to Run
#### Clone the Repository:
```sh
 git clone https://github.com/Dharmraj07/Foodiv-App-v3.git
 cd Foodiv-App-v3
```

### Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a **.env** file and configure the following:
   ```env
   MONGO_URI=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   SMTP_EMAIL=your_email
   SMTP_PASSWORD=your_email_password
   ```
4. Start the backend server:
   ```sh
   npm run dev
   ```



## Usage
- **Admin Login**: Navigate to the admin panel and log in using Firebase Authentication.
- **Manage Categories & Recipes**: Admin can add/edit/delete categories and recipes from the panel.
- **User Interaction**: Users can browse food categories and view recipes.
- **Order & Payment**: Users can add items to their cart, checkout securely, and track their orders.



