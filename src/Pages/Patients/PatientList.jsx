import React, { useEffect, useState } from "react";
import { Table, Button, Space, message, Input, Tag, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";

const { Search } = Input;

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/patients")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPatients(data.data);
      })
      .catch(() => message.error("Failed to load patients"));
  }, []);

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  // Filtered patients based on search text
  const filteredPatients = patients.filter((p) => {
    const fullName = `${p.firstName} ${p.middleName || ""} ${
      p.lastName || ""
    }`.toLowerCase();
    return (
      fullName.includes(searchText) ||
      p.mrn.toLowerCase().includes(searchText) ||
      (p.mobileNumber || "").includes(searchText) ||
      (p.city || "").toLowerCase().includes(searchText)
    );
  });

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

  const patientTypeTag = (type) => {
    switch (type?.toLowerCase()) {
      case "general":
        return <Tag color="blue">General</Tag>;
      case "vip":
        return <Tag color="purple">VIP</Tag>;
      case "corporate":
        return <Tag color="cyan">Corporate</Tag>;
      default:
        return <Tag color="gray">{type || "N/A"}</Tag>;
    }
  };

  const columns = [
    { title: "MRN", dataIndex: "mrn", key: "mrn" },
    {
      title: "Full Name",
      render: (_, r) =>
        `${r.firstName} ${r.middleName || ""} ${r.lastName || ""}`,
      key: "name",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => genderTag(gender),
    },
    { title: "Mobile", dataIndex: "mobileNumber", key: "mobileNumber" },
    { title: "City", dataIndex: "city", key: "city" },
    {
      title: "Patient Type",
      dataIndex: "patientType",
      key: "patientType",
      render: (type) => patientTypeTag(type),
    },
    {
      title: "Actions",
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
      key: "actions",
    },
  ];

  return (
    <>
      {/* Global Search + Create Button */}
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Col flex="auto">
          <Search
            placeholder="Search by name, MRN, mobile, or city"
            allowClear
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => navigate("/patients/create")}
            style={{ marginLeft: 8 }}
          >
            Create New Patient
          </Button>
        </Col>
      </Row>

      <Table
        rowKey="mrn"
        columns={columns}
        dataSource={filteredPatients}
        bordered
        size="small"
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 10 }}
      />
    </>
  );
};

export default PatientList;
