import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  message,
  Tag,
  Input,
  Card,
  Row,
  Col,
  Typography,
} from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/patients")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPatients(data.data);
          setFilteredPatients(data.data);
        }
      })
      .catch(() => message.error("Failed to load patients"));
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = patients.filter(
      (p) =>
        p.firstName?.toLowerCase().includes(value) ||
        p.middleName?.toLowerCase().includes(value) ||
        p.lastName?.toLowerCase().includes(value) ||
        p.mobileNumber?.includes(value) ||
        p.mrn?.includes(value) ||
        p.address?.[2]?.toLowerCase().includes(value) // city is stored at index 2
    );
    setFilteredPatients(filtered);
  };

  const genderTag = (gender) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return <Tag color="blue">Male</Tag>;
      case "female":
        return <Tag color="pink">Female</Tag>;
      default:
        return <Tag color="gray">{gender || "N/A"}</Tag>;
    }
  };

  const ageTag = (age) => {
    if (age < 18) return <Tag color="green">{age}</Tag>;
    if (age < 60) return <Tag color="blue">{age}</Tag>;
    return <Tag color="volcano">{age}</Tag>;
  };

  const patientTypeTag = (type) => {
    switch (type?.toLowerCase()) {
      case "vip":
        return <Tag color="gold">VIP</Tag>;
      case "corporate":
        return <Tag color="geekblue">Corporate</Tag>;
      case "general":
        return <Tag color="green">General</Tag>;
      default:
        return <Tag color="gray">{type || "N/A"}</Tag>;
    }
  };

  const columns = [
    { title: "MRN", dataIndex: "mrn", key: "mrn" },
    {
      title: "Full Name",
      key: "name",
      render: (_, r) =>
        `${r.firstName} ${r.middleName || ""} ${r.lastName || ""}`,
    },
    { title: "Mobile", dataIndex: "mobileNumber", key: "mobileNumber" },
    {
      title: "City",
      key: "city",
      render: (_, r) => r.address?.[2] || "N/A",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      render: (age) => ageTag(age),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => genderTag(gender),
    },
    {
      title: "Patient Type",
      dataIndex: "patientType",
      key: "patientType",
      render: (type) => patientTypeTag(type),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => navigate(`/patients/update/${record.mrn}`)}
          >
            Update
          </Button>
          <Button
            type="primary"
            size="small"
            danger
            onClick={() => navigate(`/patients/delete/${record.mrn}`)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card style={{ padding: "20px" }}>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "16px" }}
      >
        <Col>
          <Title level={4}>Patient List</Title>
        </Col>
        <Col>
          <Button type="primary" onClick={() => navigate("/patients/create")}>
            Create New Patient
          </Button>
        </Col>
      </Row>

      <Row style={{ marginBottom: "16px" }}>
        <Col>
          <Input
            placeholder="Search patients..."
            value={searchText}
            onChange={handleSearch}
            style={{ width: 300 }}
          />
        </Col>
      </Row>

      <Table
        rowKey="mrn"
        columns={columns}
        dataSource={filteredPatients}
        bordered
        size="small" // smaller size
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 10 }}
        rowClassName={(record, index) =>
          index % 2 === 0 ? "table-row-light" : "table-row-dark"
        }
      />
    </Card>
  );
};

export default PatientList;
