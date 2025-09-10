import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Row,
  Col,
  Card,
  Radio,
  message,
} from "antd";
import axios from "axios";
import moment from "moment";

const { Option } = Select;

const UpdatePatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [patientType, setPatientType] = useState("general");
  const [referredBy, setReferredBy] = useState("institute");

  // Fetch existing patient
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data } = await axios.get(`/api/patients/${id}`);
        if (data) {
          setPatientType(data.patientType || "general");
          setReferredBy(data.referredBy?.type || "institute");

          form.setFieldsValue({
            ...data,
            dateOfBirth: data.dateOfBirth
              ? moment(data.dateOfBirth, "DD-MM-YYYY")
              : null,
            address: data.address || {},
            emergencyContact: data.emergencyContact || {},
            referredBy: data.referredBy || {},
          });
        }
      } catch (error) {
        console.error(error);
        message.error("Failed to load patient data");
      }
    };
    fetchPatient();
  }, [id, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        dateOfBirth: values.dateOfBirth
          ? values.dateOfBirth.format("DD-MM-YYYY")
          : null,
      };
      await axios.put(`/api/patients/${id}`, payload);
      message.success("Patient updated successfully");
      navigate("/patientInfo/list");
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" style={{ marginTop: 24 }}>
      <Col xs={24} md={20} lg={16}>
        <Card title="Update Patient Information" bordered>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              patientType: "general",
              gender: "male",
              nationality: "Indian",
            }}
          >
            {/* MRN */}
            <Form.Item label="MRN Number" name="mrnNumber">
              <Input disabled />
            </Form.Item>

            {/* Names */}
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="First Name"
                  name="firstname"
                  rules={[
                    { required: true, message: "First name is required" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Middle Name" name="middlename">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Last Name"
                  name="lastname"
                  rules={[{ required: true, message: "Last name is required" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            {/* Aadhar */}
            <Form.Item label="Aadhar Number" name="aadharNumber">
              <Input maxLength={12} />
            </Form.Item>

            {/* Patient Type */}
            <Form.Item label="Patient Type" name="patientType">
              <Select onChange={(val) => setPatientType(val)}>
                <Option value="general">General</Option>
                <Option value="vip">VIP</Option>
                <Option value="corporate">Corporate</Option>
              </Select>
            </Form.Item>

            {/* Gender */}
            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: "Gender is required" }]}
            >
              <Radio.Group>
                <Radio value="male">Male</Radio>
                <Radio value="female">Female</Radio>
                <Radio value="other">Other</Radio>
              </Radio.Group>
            </Form.Item>

            {/* DOB + Age */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Date of Birth" name="dateOfBirth">
                  <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Age" name="age">
                  <Input type="number" />
                </Form.Item>
              </Col>
            </Row>

            {/* Contact */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Mobile Number"
                  name="mobileNumber"
                  rules={[
                    { required: true, message: "Mobile number is required" },
                  ]}
                >
                  <Input maxLength={10} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Email" name="email">
                  <Input type="email" />
                </Form.Item>
              </Col>
            </Row>

            {/* Nationality + Religion */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Nationality" name="nationality">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Religion" name="religion">
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            {/* Address */}
            <Card type="inner" title="Address">
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="House No" name={["address", "houseNo"]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Street" name={["address", "street"]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="City" name={["address", "city"]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="District" name={["address", "district"]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="State" name={["address", "state"]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Country" name={["address", "country"]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Pincode" name={["address", "pincode"]}>
                <Input maxLength={6} />
              </Form.Item>
            </Card>

            {/* Emergency Contact */}
            <Card
              type="inner"
              title="Emergency Contact"
              style={{ marginTop: 16 }}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="Contact Person"
                    name={["emergencyContact", "personName"]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Relation"
                    name={["emergencyContact", "relation"]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Number"
                    name={["emergencyContact", "number"]}
                  >
                    <Input maxLength={10} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Referred By */}
            <Card type="inner" title="Referred By" style={{ marginTop: 16 }}>
              <Form.Item label="Type" name={["referredBy", "type"]}>
                <Radio.Group
                  onChange={(e) => setReferredBy(e.target.value)}
                  value={referredBy}
                >
                  <Radio value="institute">Institute</Radio>
                  <Radio value="employee">Employee</Radio>
                </Radio.Group>
              </Form.Item>

              {referredBy === "institute" ? (
                <Form.Item
                  label="Institute Name"
                  name={["referredBy", "instituteName"]}
                >
                  <Input />
                </Form.Item>
              ) : (
                <>
                  <Form.Item
                    label="Employee ID"
                    name={["referredBy", "employeeId"]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Employee Name"
                    name={["referredBy", "employeeName"]}
                  >
                    <Input />
                  </Form.Item>
                </>
              )}

              <Form.Item
                label="Referrer Mobile No"
                name={["referredBy", "mobileNo"]}
              >
                <Input maxLength={10} />
              </Form.Item>
            </Card>

            {/* Submit */}
            <Form.Item style={{ marginTop: 20 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Patient
              </Button>
              <Button
                style={{ marginLeft: 10 }}
                onClick={() => navigate("/patientInfo/list")}
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default UpdatePatient;
