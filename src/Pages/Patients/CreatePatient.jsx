import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  message,
  Row,
  Col,
  Divider,
  Card,
} from "antd";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const CreatePatient = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [referralMode, setReferralMode] = useState("");
  const responsiveCol = { xs: 24, sm: 12, md: 8 };

  const onFinish = async (values) => {
    setLoading(true);

    // Build referral only if mode is selected
    const referralPayload = values.referral?.mode
      ? {
          mode: values.referral.mode,
          instituteName: values.referral.instituteName || "",
          instituteContact: values.referral.instituteContact || "",
          employeeName: values.referral.employeeName || "",
          employeeId: values.referral.employeeId || "",
          employeeContact: values.referral.employeeContact || "",
        }
      : undefined;

    const payload = {
      ...values,
      patientType: values.patientType.toLowerCase(),
      dateOfBirth: values.dateOfBirth
        ? values.dateOfBirth.format("YYYY-MM-DD")
        : null,
      address: [
        values.houseNo || "",
        values.street || "",
        values.city || "",
        values.state || "",
        values.country || "",
        values.pincode || "",
      ],
      emergencyContact: {
        contactPersonName: values.emergencyContactName || "",
        relation: values.emergencyContactRelation || "",
        mobileNumber: values.emergencyContactMobile || "",
      },
      ...(referralPayload ? { referral: referralPayload } : {}),
    };

    try {
      const res = await fetch("http://localhost:5000/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        message.success("Patient created successfully!");
        navigate("/patients/list");
      } else {
        message.error(data.message || "Failed to create patient");
      }
    } catch (err) {
      message.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sectionStyle = {
    backgroundColor: "#f0f2f5",
    padding: "16px",
    marginBottom: "16px",
    borderRadius: "8px",
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    padding: "16px",
    borderRadius: "6px",
    border: "none",
  };

  return (
    <div style={{ backgroundColor: "#f0f2f5", padding: "24px" }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        scrollToFirstError
        initialValues={{ patientType: "general" }}
      >
        {/* Basic Info */}
        <div style={sectionStyle}>
          <Card style={cardStyle} bordered={false}>
            <Divider orientation="left">Basic Information</Divider>
            <Row gutter={16}>
              <Col {...responsiveCol}>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[
                    { required: true, message: "First name is required" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col {...responsiveCol}>
                <Form.Item name="middleName" label="Middle Name">
                  <Input />
                </Form.Item>
              </Col>
              <Col {...responsiveCol}>
                <Form.Item name="lastName" label="Last Name">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col {...responsiveCol}>
                <Form.Item name="patientType" label="Patient Type">
                  <Select placeholder="Select Patient Type">
                    <Option value="general">General</Option>
                    <Option value="vip">VIP</Option>
                    <Option value="corporate">Corporate</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col {...responsiveCol}>
                <Form.Item
                  name="gender"
                  label="Gender"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Select Gender">
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col {...responsiveCol}>
                <Form.Item
                  name="mobileNumber"
                  label="Mobile Number"
                  rules={[
                    { required: true, message: "Mobile number is required" },
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "Must be 10-digit number",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col {...responsiveCol}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ type: "email" }]}
                >
                  <Input type="email" />
                </Form.Item>
              </Col>
              <Col {...responsiveCol}>
                <Form.Item name="religion" label="Religion">
                  <Input />
                </Form.Item>
              </Col>
              <Col {...responsiveCol}>
                <Form.Item
                  name="aadharNumber"
                  label="Aadhar Number"
                  rules={[
                    {
                      pattern: /^[0-9]{12}$/,
                      message: "Aadhar must be 12 digits",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </div>

        {/* Address */}
        <div style={sectionStyle}>
          <Card style={cardStyle} bordered={false}>
            <Divider orientation="left">Address</Divider>
            <Row gutter={16}>
              <Col {...responsiveCol}>
                <Form.Item name="houseNo" label="House No">
                  <Input />
                </Form.Item>
              </Col>
              <Col {...responsiveCol}>
                <Form.Item name="street" label="Street">
                  <Input />
                </Form.Item>
              </Col>
              <Col {...responsiveCol}>
                <Form.Item name="city" label="City">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col {...responsiveCol}>
                <Form.Item name="state" label="State">
                  <Input />
                </Form.Item>
              </Col>
              <Col {...responsiveCol}>
                <Form.Item name="country" label="Country" initialValue="India">
                  <Input />
                </Form.Item>
              </Col>
              <Col {...responsiveCol}>
                <Form.Item name="pincode" label="Pincode">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </div>

        {/* Other Info */}
        <div style={sectionStyle}>
          <Card style={cardStyle} bordered={false}>
            <Divider orientation="left">Other Info</Divider>
            <Row gutter={16}>
              <Col {...responsiveCol}>
                <Form.Item name="dateOfBirth" label="Date of Birth">
                  <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
                </Form.Item>
              </Col>
              <Col {...responsiveCol}>
                <Form.Item name="age" label="Age">
                  <Input type="number" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </div>

        {/* Emergency Contact */}
        <div style={sectionStyle}>
          <Card style={cardStyle} bordered={false}>
            <Divider orientation="left">Emergency Contact</Divider>
            <Row gutter={16}>
              <Col {...responsiveCol}>
                <Form.Item
                  name="emergencyContactName"
                  label="Contact Person Name"
                >
                  <Input placeholder="Name" />
                </Form.Item>
              </Col>
              <Col {...responsiveCol}>
                <Form.Item name="emergencyContactRelation" label="Relation">
                  <Input placeholder="Relation" />
                </Form.Item>
              </Col>
              <Col {...responsiveCol}>
                <Form.Item
                  name="emergencyContactMobile"
                  label="Mobile Number"
                  rules={[
                    {
                      pattern: /^[0-9]{10}$/,
                      message: "Must be 10-digit number",
                    },
                  ]}
                >
                  <Input placeholder="Mobile Number" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </div>

        {/* Referral Info */}
        <div style={sectionStyle}>
          <Card style={cardStyle} bordered={false}>
            <Divider orientation="left">Referral</Divider>
            <Row gutter={16}>
              <Col {...responsiveCol}>
                <Form.Item name={["referral", "mode"]} label="Referral Mode">
                  <Select
                    placeholder="Select Mode"
                    allowClear
                    onChange={(val) => setReferralMode(val || "")}
                  >
                    <Option value="institute">Institute</Option>
                    <Option value="employee">Employee</Option>
                  </Select>
                </Form.Item>
              </Col>

              {referralMode === "institute" && (
                <>
                  <Col {...responsiveCol}>
                    <Form.Item
                      name={["referral", "instituteName"]}
                      label="Institute Name"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col {...responsiveCol}>
                    <Form.Item
                      name={["referral", "instituteContact"]}
                      label="Institute Contact"
                      rules={[
                        {
                          pattern: /^[0-9]{10}$/,
                          message: "Must be 10-digit number",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </>
              )}

              {referralMode === "employee" && (
                <>
                  <Col {...responsiveCol}>
                    <Form.Item
                      name={["referral", "employeeName"]}
                      label="Employee Name"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col {...responsiveCol}>
                    <Form.Item
                      name={["referral", "employeeId"]}
                      label="Employee ID"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col {...responsiveCol}>
                    <Form.Item
                      name={["referral", "employeeContact"]}
                      label="Employee Contact"
                      rules={[
                        {
                          pattern: /^[0-9]{10}$/,
                          message: "Must be 10-digit number",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </>
              )}
            </Row>
          </Card>
        </div>

        {/* Submit */}
        <Form.Item style={{ marginTop: 16 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Patient
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => navigate("/patients/list")}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreatePatient;
