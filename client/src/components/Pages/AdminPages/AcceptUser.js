import React, { useEffect, useState } from "react";
import AdminHeader from "../../../shared/Pages/AdminHeader.js";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

const AcceptUser = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [limits, setLimits] = useState([]);
  const getNewUsers = async () => {
    const res = await axios.get("http://localhost:4000/admin/get-new-users", {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        "Access-Control-Allow-Headers":
          "append,delete,entries,foreach,get,has,keys,set,values,Authorization",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        userid: `${localStorage.getItem("id")}`,
      },
    });
    if (res.data.message == "get all users successfully.") {
      setData(res.data.allData);
    }
  };
  const approval = async (userID) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    console.log(localStorage.getItem("token"));
    const res = await axios({
      method: "put",
      url: `http://localhost:4000/admin/get-new-users/${userID}&${limits.limits}`,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        "Access-Control-Allow-Headers":
          "append,delete,entries,foreach,get,has,keys,set,values,Authorization",
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${localStorage.getItem("token")}`,
        userid: `${localStorage.getItem("id")}`,
      },
    });
    if (res.status == 200) {
      alert("Added Successfuly.");
      navigate("/admin/book/manage");
    } else {
      alert("Something Wrong.");
    }
  };
  const rejectUser = async (id) => {
    const res = await axios({
      method: "delete",
      url: `http://localhost:4000/admin/reject-user/${id}`,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        "Access-Control-Allow-Headers":
          "append,delete,entries,foreach,get,has,keys,set,values,Authorization",
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${localStorage.getItem("token")}`,
        userid: `${localStorage.getItem("id")}`,
      },
    });
    if (res.status == 202) {
      getNewUsers();
      setShow(true);
    }
  };
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    } else {
      getNewUsers();
    }
  }, []);
  return (
    <>
      {show ? (
        <Alert variant="danger" onClose={() => setShow(false)} dismissible>
          User rejected.
        </Alert>
      ) : (
        ""
      )}
      <AdminHeader />
      <div className="container mt-2">
        <h1 className="text-center mt-2 mb-5">Manage Users Acconts</h1>
        <div className="d-flex justify-content-between align-content-start flex-wrap m-3 ">
          {data.length > 0
            ? data.map((el, i) => {
                return (
                  <>
                    <Card
                      style={{ width: "22rem", height: "18rem" }}
                      className="mb-3"
                    >
                      <Card.Body /* className="text-center" */>
                        <Card.Title>Name : {el.name}</Card.Title>
                        <Card.Text>Email :{el.email}</Card.Text>
                        <Card.Text>Phone :{el.phone}</Card.Text>
                        <Card.Text>
                          <Form.Group
                            className="mb-3"
                            controlId="formBasicDescription"
                          >
                            <Form.Label>Limits</Form.Label>
                            <Form.Control
                              type="text"
                              name="limits"
                              onChange={(e) => {
                                setLimits({
                                  ...limits,
                                  limits: e.target.value,
                                });
                              }}
                            />
                          </Form.Group>
                        </Card.Text>
                        <div className="d-flex justify-content-around text-center">
                          <Button
                            variant="success"
                            size="lg"
                            onClick={() => {
                              approval(el.id);
                            }}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="danger"
                            size="lg"
                            onClick={(e) => {
                              e.preventDefault();
                              rejectUser(el.id);
                            }}
                          >
                            Reject
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </>
                );
              })
            : ""}
        </div>
      </div>
    </>
  );
};

export default AcceptUser;
