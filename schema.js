const joi=require("joi");
const expenses = require("./models/expenses.js");
module.exports.expenseSchema=joi.object({
    Expense:joi.object({
        name:joi.string().required(),
        description:joi.string().required(),
        to:joi.number().required().min(0),
        phoneNumber:joi.number().required(),
        expenses:joi.number().required(),
    }).required()
});