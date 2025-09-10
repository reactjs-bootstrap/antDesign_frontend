import React, { useEffect, useState } from "react";
import { Card, Button, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const DeletePatient = () => {
  const { mrn } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/patients/${mrn}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPatient(data.data);
      });
  }, [mrn]);

  const handleDelete = () => {
    fetch(`http://localhost:5000/api/patients/${mrn}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          message.success("Patient deleted!");
          navigate("/patients/list");
        } else {
          message.error(data.message);
        }
      });
  };

  if (!patient) return <p>Loading...</p>;

  return (
    <Card title="Delete Patient">
      <p>
        Are you sure you want to delete patient{" "}
        <b>
          {patient.firstName} {patient.lastName}
        </b>{" "}
        (MRN: {patient.mrn})?
      </p>
      <Button type="primary" danger onClick={handleDelete}>
        Yes, Delete
      </Button>
      <Button
        style={{ marginLeft: 10 }}
        onClick={() => navigate("/patients/list")}
      >
        Cancel
      </Button>
    </Card>
  );
};

export default DeletePatient;
