import React, { useState } from "react";
import { Form, Input, Select, Button, DatePicker, Radio, message } from "antd";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const CreatePatient = () => {
  const [form] = Form.useForm();
  const [referredType, setReferredType] = useState("employee");
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      dateOfBirth: values.dateOfBirth
        ? values.dateOfBirth.format("DD-MM-YYYY")
        : undefined,
      referredBy: {
        type: values.referredByType,
        instituteName: values.instituteName,
        employeeId: values.employeeId,
        employeeName: values.employeeName,
        refereeMobileNumber: values.refereeMobileNumber,
      },
      address: values.address,
      emergencyContact: values.emergencyContact,
    };

    try {
      await axios.post("http://localhost:5000/api/patients", payload);
      message.success("Patient created successfully");
      navigate("/patientInfo/list");
    } catch (err) {
      message.error(err.response?.data?.error || "Failed to create patient");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Add New Patient</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Basic fields */}
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="middleName" label="Middle Name">
          <Input />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
          <Select>
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="mobileNumber"
          label="Mobile Number"
          rules={[
            { required: true },
            {
              pattern: /^\d{10}$/,
              message: "Enter valid 10-digit mobile number",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ type: "email" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="dateOfBirth" label="Date of Birth">
          <DatePicker format="DD-MM-YYYY" />
        </Form.Item>
        <Form.Item name="age" label="Age">
          <Input type="number" />
        </Form.Item>

        {/* Referred By */}
        <Form.Item name="referredByType" label="Referred By">
          <Radio.Group onChange={(e) => setReferredType(e.target.value)}>
            <Radio value="employee">Employee</Radio>
            <Radio value="institute">Institute</Radio>
          </Radio.Group>
        </Form.Item>
        {referredType === "employee" && (
          <>
            <Form.Item name="employeeId" label="Employee ID">
              <Input />
            </Form.Item>
            <Form.Item name="employeeName" label="Employee Name">
              <Input />
            </Form.Item>
            <Form.Item name="refereeMobileNumber" label="Referee Mobile Number">
              <Input />
            </Form.Item>
          </>
        )}
        {referredType === "institute" && (
          <>
            <Form.Item name="instituteName" label="Institute Name">
              <Input />
            </Form.Item>
            <Form.Item name="refereeMobileNumber" label="Referee Mobile Number">
              <Input />
            </Form.Item>
          </>
        )}

        <Button type="primary" htmlType="submit">
          Create Patient
        </Button>
      </Form>
    </div>
  );
};

export default CreatePatient;
