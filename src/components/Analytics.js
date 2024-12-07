import React from "react";
import { Progress, Tooltip } from "antd";

const Analytics = ({ allTransection }) => {
  const categories = [
    "Salary",
    "Tip",
    "Project",
    "Food",
    "Movie",
    "Bills",
    "Medical",
    "Fee",
    "Tax",
  ];

  // Transaction Calculations
  const totalTransaction = allTransection.length;
  const totalIncomeTransactions = allTransection.filter(
    (transaction) => transaction.type === "income"
  );
  const totalExpenseTransactions = allTransection.filter(
    (transaction) => transaction.type === "expense"
  );

  const totalIncomePercent =
    (totalIncomeTransactions.length / totalTransaction) * 100;
  const totalExpensePercent =
    (totalExpenseTransactions.length / totalTransaction) * 100;

  // Turnover Calculations
  const totalTurnover = allTransection.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  const totalIncomeTurnover = allTransection
    .filter((transaction) => transaction.type === "income")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalExpenseTurnover = allTransection
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalIncomeTurnoverPercent =
    (totalIncomeTurnover / totalTurnover) * 100;
  const totalExpenseTurnoverPercent =
    (totalExpenseTurnover / totalTurnover) * 100;

  return (
    <div className="analytics-container">
      {/* Overall Stats */}
      <div className="row">
        <div className="col-md-6">
          <div className="card analytics-card total-card">
            <div className="card-header">📊 Total Transactions</div>
            <div className="card-body">
              <Tooltip title="Number of income transactions">
                <h5 className="text-success">
                  Income: {totalIncomeTransactions.length}
                </h5>
              </Tooltip>
              <Tooltip title="Number of expense transactions">
                <h5 className="text-danger">
                  Expense: {totalExpenseTransactions.length}
                </h5>
              </Tooltip>
              <div className="progress-container">
                <Progress
                  type="circle"
                  strokeColor="#52c41a"
                  percent={totalIncomePercent.toFixed(0)}
                />
                <Progress
                  type="circle"
                  strokeColor="#ff4d4f"
                  percent={totalExpensePercent.toFixed(0)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card analytics-card total-card">
            <div className="card-header">💰 Total Turnover</div>
            <div className="card-body">
              <Tooltip title="Total income turnover">
                <h5 className="text-success">Income: ₹{totalIncomeTurnover}</h5>
              </Tooltip>
              <Tooltip title="Total expense turnover">
                <h5 className="text-danger">
                  Expense: ₹{totalExpenseTurnover}
                </h5>
              </Tooltip>
              <div className="progress-container">
                <Progress
                  type="circle"
                  strokeColor="#52c41a"
                  percent={totalIncomeTurnoverPercent.toFixed(0)}
                />
                <Progress
                  type="circle"
                  strokeColor="#ff4d4f"
                  percent={totalExpenseTurnoverPercent.toFixed(0)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Stats */}
      <div className="row mt-4">
        <div className="col-md-6">
          <h4 className="category-header">Category-wise Income</h4>
          {categories.map((category) => {
            const amount = allTransection
              .filter(
                (transaction) =>
                  transaction.type === "income" &&
                  transaction.category.toLowerCase() === category.toLowerCase()
              )
              .reduce((acc, transaction) => acc + transaction.amount, 0);
            return (
              amount > 0 && (
                <div className="card category-card income-card">
                  <div className="card-body">
                    <Tooltip title={`Total income from ${category}`}>
                      <h5>{category}</h5>
                    </Tooltip>
                    <Progress
                      percent={((amount / totalIncomeTurnover) * 100).toFixed(
                        0
                      )}
                      strokeColor="#52c41a"
                    />
                  </div>
                </div>
              )
            );
          })}
        </div>

        <div className="col-md-6">
          <h4 className="category-header">Category-wise Expense</h4>
          {categories.map((category) => {
            const amount = allTransection
              .filter(
                (transaction) =>
                  transaction.type === "expense" &&
                  transaction.category.toLowerCase() === category.toLowerCase()
              )
              .reduce((acc, transaction) => acc + transaction.amount, 0);
            return (
              amount > 0 && (
                <div className="card category-card expense-card">
                  <div className="card-body">
                    <Tooltip title={`Total expense on ${category}`}>
                      <h5>{category}</h5>
                    </Tooltip>
                    <Progress
                      percent={((amount / totalExpenseTurnover) * 100).toFixed(
                        0
                      )}
                      strokeColor="#ff4d4f"
                    />
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
