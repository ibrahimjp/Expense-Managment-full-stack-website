import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  message,
  Modal,
  Select,
  Table,
  DatePicker,
  Button,
  Badge,
} from "antd";
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import Spinner from "../components/Spinner";
import moment from "moment";
import Analytics from "../components/Analytics";

const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransection, setAllTransection] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectedate] = useState([]);
  const [type, setType] = useState("all");
  const [viewData, setViewData] = useState("table");
  const [editable, setEditable] = useState(null);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amount) => <span>₹{amount}</span>,
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (text) =>
        text === "income" ? (
          <Badge color="green" text="Income" />
        ) : (
          <Badge color="red" text="Expense" />
        ),
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Reference",
      dataIndex: "refrence",
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div className="flex gap-4">
          <EditOutlined
            className="text-blue-500 cursor-pointer"
            onClick={() => {
              setEditable(record);
              setShowModal(true);
            }}
          />
          <DeleteOutlined
            className="text-red-500 cursor-pointer"
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    const getAllTransactions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setLoading(true);
        const res = await axios.post("/api/v1/transections/get-transection", {
          userid: user._id,
          frequency,
          selectedDate,
          type,
        });
        setLoading(false);
        setAllTransection(res.data);
      } catch (error) {
        setLoading(false);
        message.error("Error fetching transactions");
      }
    };
    getAllTransactions();
  }, [frequency, selectedDate, type]);

  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post("/api/v1/transections/delete-transection", {
        transacationId: record._id,
      });
      setLoading(false);
      message.success("Transaction deleted successfully!");
    } catch (error) {
      setLoading(false);
      message.error("Error deleting transaction");
    }
  };

  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      if (editable) {
        await axios.post("/api/v1/transections/edit-transection", {
          payload: { ...values, userId: user._id },
          transacationId: editable._id,
        });
        message.success("Transaction updated successfully!");
      } else {
        await axios.post("/api/v1/transections/add-transection", {
          ...values,
          userid: user._id,
        });
        message.success("Transaction added successfully!");
      }
      setLoading(false);
      setShowModal(false);
      setEditable(null);
    } catch (error) {
      setLoading(false);
      message.error("Error saving transaction");
    }
  };

  return (
    <Layout>
      {loading && <Spinner />}
      {/* Hero Section */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-2">Welcome to Expense Tracker</h2>
        <p className="text-gray-600">
          Track your income and expenses effortlessly!
        </p>
        <Button
          type="primary"
          icon={<PlusCircleOutlined />}
          className="mt-4"
          onClick={() => setShowModal(true)}
        >
          Add Transaction
        </Button>
      </div>

      {/* Filters Section */}
      <div className="filters flex flex-wrap gap-6 p-4 bg-gray-100 rounded-lg shadow-md">
        <div>
          <h6 className="font-semibold">Select Frequency</h6>
          <Select
            value={frequency}
            onChange={(value) => setFrequency(value)}
            style={{ width: 150 }}
          >
            <Select.Option value="7">Last Week</Select.Option>
            <Select.Option value="30">Last Month</Select.Option>
            <Select.Option value="365">Last Year</Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
          </Select>
          {frequency === "custom" && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => setSelectedate(values)}
              style={{ marginTop: "10px" }}
            />
          )}
        </div>

        <div>
          <h6 className="font-semibold">Select Type</h6>
          <Select
            value={type}
            onChange={(value) => setType(value)}
            style={{ width: 150 }}
          >
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="income">Income</Select.Option>
            <Select.Option value="expense">Expense</Select.Option>
          </Select>
        </div>

        <div className="flex gap-4 items-center">
          <UnorderedListOutlined
            className={`text-2xl cursor-pointer ${
              viewData === "table" ? "text-blue-500" : "text-gray-500"
            }`}
            onClick={() => setViewData("table")}
          />
          <AreaChartOutlined
            className={`text-2xl cursor-pointer ${
              viewData === "analytics" ? "text-blue-500" : "text-gray-500"
            }`}
            onClick={() => setViewData("analytics")}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="content p-4 mt-6 bg-white rounded-lg shadow-md">
        {viewData === "table" ? (
          <Table
            columns={columns}
            dataSource={allTransection}
            rowClassName="hover:bg-gray-50"
          />
        ) : (
          <Analytics allTransection={allTransection} />
        )}
      </div>

      {/* Modal */}
      <Modal
        title={editable ? "Edit Transaction" : "Add Transaction"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={editable}
        >
          <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Type" name="type" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="tip">Tip</Select.Option>
              <Select.Option value="project">Project</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="fee">Fee</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
              <Select.Option value="tax">Tax</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Reference" name="refrence">
            <Input />
          </Form.Item>
          <Form.Item label="Date" name="date" rules={[{ required: true }]}>
            <Input type="date" />
          </Form.Item>
          <div className="flex gap-4">
            <Button type="primary" htmlType="submit">
              Save
            </Button>
            <Button onClick={() => setShowModal(false)}>Cancel</Button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
