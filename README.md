# 📝 Blog App

A full-stack modern blogging platform built with React and Node.js, featuring a rich text editor, user authentication, and real-time notifications.

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)

## ✨ Features

- **User Authentication** - Sign up/Sign in with email or Google (Firebase Auth)
- **Rich Text Editor** - Create beautiful blog posts using Editor.js with support for:
  - Headers, lists, quotes, and code blocks
  - Embedded links and images
  - Inline code and text markers
- **User Profiles** - Customizable user profiles with bio and social links
- **Blog Management** - Create, edit, publish, and delete blogs
- **Comments & Replies** - Nested comment system with reply support
- **Notifications** - Real-time notifications for likes, comments, and replies
- **Search** - Search for blogs and users
- **Responsive Design** - Mobile-friendly UI with Tailwind CSS
- **Image Upload** - Upload images via ImageKit integration

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **React Router v7** - Client-side routing
- **Tailwind CSS v4** - Styling
- **Editor.js** - Rich text editor
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **Firebase** - Google authentication

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **ImageKit** - Image storage and CDN
- **Firebase Admin** - Server-side auth verification

## 📁 Project Structure

```
Blog App/
├── Backend/
│   ├── server.js              # Express server entry point
│   └── src/
│       ├── controllers/       # Route controllers
│       ├── DB/                 # Database connection
│       ├── middleware/         # Auth middleware
│       ├── models/             # Mongoose models
│       ├── routes/             # API routes
│       └── utils/              # Utility functions
│
└── Frontend/
    └── src/
        ├── components/         # Reusable UI components
        ├── pages/              # Page components
        ├── common/             # Shared utilities
        ├── context/            # React context
        └── assets/             # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Firebase project (for authentication)
- ImageKit account (for image uploads)

### Environment Variables

#### Backend (`Backend/.env`)
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

#### Frontend (`Frontend/.env`)
```env
VITE_API_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/blog-app.git
   cd blog-app
   ```

2. **Install Backend dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend dependencies**
   ```bash
   cd ../Frontend
   npm install
   ```

### Running the Application

1. **Start the Backend server**
   ```bash
   cd Backend
   npm run dev
   ```

2. **Start the Frontend development server**
   ```bash
   cd Frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/signin` | Login user |
| POST | `/auth/google-auth` | Google OAuth login |

### Blogs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create-blog` | Create a new blog |
| GET | `/blogs/latest-blogs` | Get latest blogs |
| GET | `/blogs/trending-blogs` | Get trending blogs |
| POST | `/blogs/search-blogs` | Search blogs |
| POST | `/blogs/get-blog` | Get single blog |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/search-user` | Search users |
| POST | `/get-profile` | Get user profile |

### Images
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/uploadBanner` | Upload image |

## 🔐 Authentication Flow

1. User signs up/signs in via email or Google
2. Server generates JWT access token
3. Token stored in session storage
4. Token sent with each API request for protected routes
5. Server middleware verifies token before processing requests

## 📱 Pages

- **Home** - Landing page with latest and trending blogs
- **Editor** - Rich text blog editor
- **Blog Page** - Individual blog view with comments
- **Profile** - User profile with published blogs
- **Search** - Search results for blogs and users
- **Dashboard** - Manage your blogs and notifications
- **Settings** - Edit profile and change password

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👤 Author

**Gobind Choudhary**

---

⭐ Star this repo if you find it helpful!
