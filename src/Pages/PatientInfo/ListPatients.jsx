import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ListPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/patients/${id}`);
      message.success("Patient deleted");
      fetchPatients();
    } catch (err) {
      message.error("Failed to delete patient");
    }
  };

  const columns = [
    { title: "MRN", dataIndex: "mrnNumber", key: "mrnNumber" },
    {
      title: "Name",
      key: "name",
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    { title: "Mobile", dataIndex: "mobileNumber", key: "mobileNumber" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => navigate(`/patientInfo/update/${record._id}`)}
          >
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Button
        type="primary"
        style={{ marginBottom: 20 }}
        onClick={() => navigate("/patientInfo/create")}
      >
        Add Patient
      </Button>
      <Table
        columns={columns}
        dataSource={patients}
        rowKey="_id"
        loading={loading}
      />
    </div>
  );
};

export default ListPatients;
