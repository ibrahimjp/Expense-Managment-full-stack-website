const mongoose = require("mongoose");
const mongoUrl = "mongodb://127.0.0.1:27017/expenses";
const Expense = require("../models/expenses.js");
const Data = require("./random.js");

main().then(() => {
  console.log("connected To DB");
}).catch(err => {
  console.log(err);
});

async function main() {
  await mongoose.connect(mongoUrl);
}

const initData = async () => {
  try {
    await Expense.deleteMany({});
    await Expense.insertMany(Data.data);
    console.log("Data initialized successfully!");
  } catch (err) {
    console.error("Error initializing data:", err);
  }
};

initData();