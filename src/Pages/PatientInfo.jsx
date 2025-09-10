import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Radio,
} from "antd";
import axios from "axios";
import moment from "moment";
import { useLocation } from "react-router-dom";

const { Option } = Select;

const PatientInfo = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [form] = Form.useForm();
  const [referredType, setReferredType] = useState("employee");

  const location = useLocation();

  // Auto open modal if /create route
  useEffect(() => {
    if (location.pathname === "/create") {
      showModal();
    }
  }, [location.pathname]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/patients");
      setPatients(res.data);
    } catch (err) {
      message.error("Failed to fetch patients");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const showModal = (patient = null) => {
    setEditingPatient(patient);
    if (patient) {
      form.setFieldsValue({
        ...patient,
        dateOfBirth: patient.dateOfBirth ? moment(patient.dateOfBirth, "DD-MM-YYYY") : null,
        referredByType: patient.referredBy?.type || "employee",
      });
      setReferredType(patient.referredBy?.type || "employee");
    } else {
      form.resetFields();
      setReferredType("employee");
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingPatient(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/patients/${id}`);
      message.success("Patient deleted");
      fetchPatients();
    } catch (err) {
      message.error("Failed to delete patient");
    }
  };

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format("DD-MM-YYYY") : undefined,
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
      if (editingPatient) {
        await axios.put(`http://localhost:5000/api/patients/${editingPatient._id}`, payload);
        message.success("Patient updated");
      } else {
        await axios.post("http://localhost:5000/api/patients", payload);
        message.success("Patient created");
      }
      fetchPatients();
      handleCancel();
    } catch (err) {
      message.error(err.response?.data?.error || "Failed to save patient");
    }
  };

  const columns = [
    { title: "MRN", dataIndex: "mrnNumber", key: "mrnNumber" },
    { title: "Name", key: "name", render: (_, record) => `${record.firstName} ${record.lastName}` },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    { title: "Mobile", dataIndex: "mobileNumber", key: "mobileNumber" },
    { title: "Age", key: "age", render: (_, record) => record.calculatedAge || record.age },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => showModal(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>Delete</Button>
        </>
      )
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      <Button type="primary" onClick={() => showModal()} style={{ marginBottom: 20 }}>
        Add Patient
      </Button>
      <Table
        columns={columns}
        dataSource={patients}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title={editingPatient ? "Edit Patient" : "Add Patient"}
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* Basic Info */}
          <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="middleName" label="Middle Name">
            <Input />
          </Form.Item>

          <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item name="mobileNumber" label="Mobile Number" rules={[
            { required: true },
            { pattern: /^\d{10}$/, message: "Enter valid 10-digit mobile number" }
          ]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[
            { type: "email", message: "Enter valid email" }
          ]}>
            <Input />
          </Form.Item>

          <Form.Item name="dateOfBirth" label="Date of Birth">
            <DatePicker format="DD-MM-YYYY" />
          </Form.Item>

          <Form.Item name="age" label="Age">
            <Input type="number" />
          </Form.Item>

          {/* Address */}
          <Form.Item label="Address">
            <Input.Group compact>
              <Form.Item name={["address", "houseNo"]} style={{ display: "inline-block", width: "30%" }}>
                <Input placeholder="House No" />
              </Form.Item>
              <Form.Item name={["address", "street"]} style={{ display: "inline-block", width: "30%", margin: "0 8px" }}>
                <Input placeholder="Street" />
              </Form.Item>
              <Form.Item name={["address", "city"]} style={{ display: "inline-block", width: "30%" }}>
                <Input placeholder="City" />
              </Form.Item>
            </Input.Group>
            <Input.Group compact style={{ marginTop: 8 }}>
              <Form.Item name={["address", "district"]} style={{ display: "inline-block", width: "30%" }}>
                <Input placeholder="District" />
              </Form.Item>
              <Form.Item name={["address", "state"]} style={{ display: "inline-block", width: "30%", margin: "0 8px" }}>
                <Input placeholder="State" />
              </Form.Item>
              <Form.Item name={["address", "country"]} style={{ display: "inline-block", width: "30%" }}>
                <Input placeholder="Country" />
              </Form.Item>
            </Input.Group>
            <Form.Item name={["address", "pincode"]}>
              <Input placeholder="Pincode" />
            </Form.Item>
          </Form.Item>

          {/* Emergency Contact */}
          <Form.Item label="Emergency Contact">
            <Form.Item name={["emergencyContact", "contactPersonName"]} label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={["emergencyContact", "relation"]} label="Relation" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={["emergencyContact", "number"]} label="Contact Number" rules={[
              { required: true },
              { pattern: /^\d{10}$/, message: "Enter valid 10-digit number" }
            ]}>
              <Input />
            </Form.Item>
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
        </Form>
      </Modal>
    </div>
  );
};

export default PatientInfo;
