import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, DatePicker, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

const UpdatePatient = () => {
  const [form] = Form.useForm();
  const { mrn } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/patients/${mrn}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const p = data.data;
          form.setFieldsValue({
            ...p,
            dateOfBirth: p.dateOfBirth ? dayjs(p.dateOfBirth) : null,
          });
        }
      });
  }, [mrn, form]);

  const onFinish = (values) => {
    fetch(`http://localhost:5000/api/patients/${mrn}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          message.success("Patient updated!");
          navigate("/patients/list");
        } else {
          message.error(data.message);
        }
      });
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
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
      <Form.Item name="lastName" label="Last Name">
        <Input />
      </Form.Item>
      <Form.Item name="patientType" label="Patient Type">
        <Select
          options={[
            { value: "general" },
            { value: "vip" },
            { value: "corporate" },
          ]}
        />
      </Form.Item>
      <Form.Item name="mobileNumber" label="Mobile Number">
        <Input />
      </Form.Item>
      <Form.Item name="dateOfBirth" label="Date of Birth">
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="age" label="Age">
        <Input type="number" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Update
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdatePatient;
