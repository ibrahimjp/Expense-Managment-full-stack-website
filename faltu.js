CRUD operations:'

3. Set Up Routes in index.js
In index.js, set up the routes for each operation.

javascript
Copy code
// index.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const Book = require("./models/book");

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/library", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"));

// Middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// ROUTES

// GET /books - Retrieve a list of all books
app.get("/books", async (req, res) => {
  const books = await Book.find({});
  res.render("books/index", { books });
});

// GET /books/:id - Retrieve details of a specific book by ID
app.get("/books/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.render("books/show", { book });
});

// GET /books/new - Form to add a new book
app.get("/books/new", (req, res) => {
  res.render("books/new");
});

// POST /books - Add a new book to the collection
app.post("/books", async (req, res) => {
  const { title, author, description, publishedYear } = req.body;
  await Book.create({ title, author, description, publishedYear });
  res.redirect("/books");
});

// GET /books/:id/edit - Form to edit an existing book
app.get("/books/:id/edit", async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.render("books/edit", { book });
});

// PUT /books/:id - Update information of a specific book
app.put("/books/:id", async (req, res) => {
  const { title, author, description, publishedYear } = req.body;
  await Book.findByIdAndUpdate(req.params.id, {
    title,
    author,
    description,
    publishedYear
  });
  res.redirect(`/books/${req.params.id}`);
});

// DELETE /books/:id - Remove a specific book from the collection
app.delete("/books/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.redirect("/books");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
4. Create the EJS Templates
1. views/books/index.ejs - Display All Books
html
Copy code
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>All Books</title>
</head>
<body>
  <h1>All Books</h1>
  <a href="/books/new">Add New Book</a>
  <ul>
    <% books.forEach(book => { %>
      <li>
        <a href="/books/<%= book._id %>"><%= book.title %></a>
        by <%= book.author %>
      </li>
    <% }) %>
  </ul>
</body>
</html>
2. views/books/show.ejs - Display Book Details
html
Copy code
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title><%= book.title %></title>
</head>
<body>
  <h1><%= book.title %></h1>
  <p>Author: <%= book.author %></p>
  <p>Description: <%= book.description %></p>
  <p>Published Year: <%= book.publishedYear %></p>
  <a href="/books/<%= book._id %>/edit">Edit</a>
  <form action="/books/<%= book._id %>?_method=DELETE" method="POST">
    <button type="submit">Delete</button>
  </form>
  <a href="/books">Back to all books</a>
</body>
</html>
3. views/books/new.ejs - Form to Add New Book
html
Copy code
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Add New Book</title>
</head>
<body>
  <h1>Add a New Book</h1>
  <form action="/books" method="POST">
    <input type="text" name="title" placeholder="Title" required>
    <input type="text" name="author" placeholder="Author" required>
    <textarea name="description" placeholder="Description"></textarea>
    <input type="number" name="publishedYear" placeholder="Published Year">
    <button type="submit">Add Book</button>
  </form>
</body>
</html>
4. views/books/edit.ejs - Form to Edit Existing Book
html
Copy code
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Edit <%= book.title %></title>
</head>
<body>
  <h1>Edit <%= book.title %></h1>
  <form action="/books/<%= book._id %>?_method=PUT" method="POST">
    <input type="text" name="title" value="<%= book.title %>" required>
    <input type="text" name="author" value="<%= book.author %>" required>
    <textarea name="description"><%= book.description %></textarea>
    <input type="number" name="publishedYear" value="<%= book.publishedYear %>">
    <button type="submit">Update Book</button>
  </form>
</body>
</html>