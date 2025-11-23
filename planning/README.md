ss# ⚙️ CIRCLE (Backend API)

<em>Built with the tools and technologies:</em>

<img src="https://img.shields.io/badge/Node.js-43853D.svg?style=flat&logo=node.js&logoColor=white" alt="Node.js">
<img src="https://img.shields.io/badge/Express-000000.svg?style=flat&logo=express&logoColor=white" alt="Express">
<img src="https://img.shields.io/badge/MongoDB-47A248.svg?style=flat&logo=mongodb&logoColor=white" alt="MongoDB">
<img src="https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white" alt="JSON">
<img src="https://img.shields.io/badge/Socket.io-010101.svg?style=flat&logo=socketdotio&logoColor=white" alt="Socket.io">
<img src="https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white" alt="npm">
<img src="https://img.shields.io/badge/Mongoose-F04D35.svg?style=flat&logo=Mongoose&logoColor=white" alt="Mongoose">
<img src="https://img.shields.io/badge/.ENV-ECD53F.svg?style=flat&logo=dotenv&logoColor=black" alt=".ENV">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" alt="JavaScript">
<img src="https://img.shields.io/badge/Nodemon-76D04B.svg?style=flat&logo=Nodemon&logoColor=white" alt="Nodemon">
<img src="https://img.shields.io/badge/Cloudinary-3448C5.svg?style=flat&logo=Cloudinary&logoColor=white" alt="Cloudinary">
<img src="https://img.shields.io/badge/Socket-C93CD7.svg?style=flat&logo=Socket&logoColor=white" alt="Socket">

## 🔗 Links

- **🚀 Deployed API:** [Insert Heroku/Fly.io/Render Link Here]
- **💻 Frontend Repository:** [project-3-ga-social-media-frontend](https://github.com/darkogolovic/project-3-ga-social-media-frontend)

---

## 📖 Overview

This repository handles the server-side logic, database connections, and API routing for the application. It serves JSON data to the React frontend and manages user authentication and data persistence.

### ✨ Key Features

- **RESTful Architecture:** Organized routes for efficient data retrieval.
- **Authentication:** JWT (JSON Web Token) implementation for secure user sessions.
- **CRUD Operations:** Full Create, Read, Update, and Delete capabilities for Posts and Comments.
- **Database Relationships:** References between Users, Posts, and Comments.

---

## 🛠️ Tech Stack

| Category       | Tech                 | Description                                       |
| :------------- | :------------------- | :------------------------------------------------ |
| **Runtime**    | Node.js              | JavaScript runtime environment.                   |
| **Framework**  | Express.js           | Web framework for handling routes and middleware. |
| **Database**   | MongoDB              | NoSQL database for flexible data storage.         |
| **ODM**        | Mongoose             | Object Data Modeling library for MongoDB.         |
| **Auth**       | JSON Web Token (JWT) | Stateless authentication mechanism.               |
| **Encryption** | Bcrypt               | Password hashing for security.                    |

---

## 💾 Data Structure

### Models

- **User:** Stores username, email, password hash, and profile image.
- **Post:** Stores post content, image URL, author reference, and timestamps.
- **Comment:** Stores text, author reference, and associated post reference.

_(Optional: Paste your ERD or Schema diagram here if you have one)_

---

## 🔌 API Endpoints

| Method     | Endpoint                  | Description              | Auth Required |
| :--------- | :------------------------ | :----------------------- | :-----------: |
| **POST**   | `/api/register`           | Register a new user      |      ❌       |
| **POST**   | `/api/login`              | Log in and receive a JWT |      ❌       |
| **GET**    | `/api/posts`              | Get all posts (Feed)     |      ❌       |
| **POST**   | `/api/posts`              | Create a new post        |      ✅       |
| **GET**    | `/api/posts/:id`          | Get a single post by ID  |      ❌       |
| **PUT**    | `/api/posts/:id`          | Update a post            |      ✅       |
| **DELETE** | `/api/posts/:id`          | Delete a post            |      ✅       |
| **POST**   | `/api/posts/:id/comments` | Add a comment to a post  |      ✅       |

---

## ⚙️ Installation & Setup

Follow these steps to get the server running locally.

### 1. Clone the Repository

```bash
git clone https://github.com/darkogolovic/project-3-ga-social-media-backend
cd project-3-ga-social-media-backend
```

### 2. Navigate to the project directory:\*\*

```sh
❯ cd project-3-ga-social-media-frontend
```

### 3. Install the dependencies:\*\*

```sh
❯ npm install
```

### Usage

Run the project with:

```sh
npm run dev
```
