const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mongoUrl = "mongodb://127.0.0.1:27017/expenses";
const Expense = require("./models/expenses");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");

main().then(() => {
  console.log("connected To DB");
}).catch(err => {
  console.log(err);
});

async function main() {
  await mongoose.connect(mongoUrl);
}

// All middlewares
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); 
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Use EJS Mate
app.engine("ejs", ejsMate);

// Check working route
app.get("/", (req, res) => {
  console.log("working route");
  res.send("Welcome to the Expense Manager!");
});

// Index Route
app.get("/expenses", async (req, res) => {
  try {
    const allExpense = await Expense.find({});
    console.log(allExpense);
    res.render("expenses/index", { allExpense });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create New Expense Form
app.get("/expenses/new", async (req, res) => {
  console.log("New expense form route hit");
  res.render("expenses/new");
});

// Create Expense - POST
app.post("/expenses", async (req, res) => {
  const { name, to, phoneNumber, expenses, description } = req.body;
  console.log("Received Data:", req.body);
  
  try {
    await Expense.create({ name, to, phoneNumber, expenses, description });
    res.redirect("/expenses");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Edit Expense Form
app.get("/expenses/:id/edit", async (req, res) => {
  const editExpense = await Expense.findById(req.params.id);
  res.render("expenses/edit", { editExpense });
});

// Update Expense - PUT
app.put("/expenses/:id", async (req, res) => {
  const edited = req.body;
  await Expense.findByIdAndUpdate(req.params.id, edited);
  res.redirect("/expenses");
});

// Delete Expense - DELETE
app.delete("/expenses/:id", async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.redirect("/expenses");
});

// Show Expense Route
app.get("/expenses/:id", async (req, res) => {
  let { id } = req.params;
  const expenseid = await Expense.findById(id);
  res.render("expenses/show", { expenseid });
});

// Start Server
app.listen(8080, () => {
  console.log("Server started, app listening on port 8080...");
});
