# MANGAZINE BACKEND

## Overview
<br>

 Mangazine is a source for Storytelling content. It's a web platform where users can discover and keep track of everything they want to read. We cover a wide range of content, such as mangas, comics, books, manhwa, magazines, etc. 
 Users can check information about what they are reading, rate titles, add titles they want to read to their 'readlist', create their own lists and we still have a lot of features coming in. At Mangazine, our goal is to be a comprehensive source of information, share amazing Storytelling works from diverse authors around the world, and connect people through culture.


 This is the backend of our platform. The project follows the MVC architecture pattern and uses MongoDB as the database.

<br>

## Table of Contents

1. [Installation](#installation)
2. [Project Structure](#project-structure)
3. [Environment Variables](#environment-variables)
4. [Available Scripts](#available-scripts)
5. [API Documentation](#api-documentation)
6. [Database Schema](#database-schema)
7. [Contributing](#contributing)
8. [License](#license)

<br>

## Prerequisites
> Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

<br>

## Clone the repository
 ```
git clone https://github.com/lopesmfelipe/mangazine-backend.git
```
```
cd yourproject
```

## Install dependencies
```
npm install
```

## Run MongoDB

Ensure MongoDB is running locally or provide a MongoDB Atlas connection URL in your environment variables.


## Project Structure

```
├── src/                # Source code for the application
│   ├── controllers/    # Handles incoming requests and responses
│   ├── models/         # MongoDB schemas and business logic
│   ├── routes/         # Route definitions for handling requests
│   ├── utils/          # Utility functions and helpers
│   ├── app.ts          # Main application file
│   └── server.ts       # Server setup and startup
├── .env                # Environment variables and database configuration
├── dist/               # Compiled JavaScript files
├── package.json        # Project metadata and scripts
├── tsconfig.json       # TypeScript configuration file
├── README.md           # Project overview and instructions
├── LICENSE             # License for the project

```


## Environment Variables

> Create a .env file in the root directory and add the following variables:

Environment
```
NODE_ENV=development
```

Server
```
PORT=5000
```

Database
```
DATABASE=mongodb://localhost:27017/your-db-name
```

Client Url
```
http://localhost:5173/
```

<br>

## Available Scripts

> #### Running the application in development

``` 
npm run start:dev
```

This will start the application using nodemon for hot-reloading.

> #### Running the application in production
``` 
npm start
 ```

This will start the application using node.

<br>


## API Documentation
Base URL
http://localhost:5000/api/v1

Endpoints
User Routes
Method	Endpoint	Description
POST	/users/register	Register a new user
POST	/users/login	Login a user
GET	/users/me	Get logged-in user info
Title Routes
Method	Endpoint	Description
GET	/titles	Fetch all titles
POST	/titles	Create a new title
GET	/titles/:id	Fetch a single title
PUT	/titles/:id	Update a title
DELETE	/titles/:id	Delete a title
Add more routes as required.

## Database Schema

 > ### User Model

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

<br>

> ### Title Model

const titleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  author: { type: String, required: true },
  genre: [String],
  rating: { type: Number, default: 0 }
});

<br>

## Contributing

1. Fork the repository
2. Create a new feature branch: git checkout -b my-new-feature
3. Commit your changes: git commit -m 'Add some feature'
4. Push to the branch: git push origin my-new-feature
5. Submit a pull request

<br>

## License

This project is licensed under the MIT License - see the LICENSE file for details.
