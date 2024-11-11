const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  name: String,
  to: String,
  phoneNumber: Number,
  expenses: Number,    // Correct field name
  description: String,
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;