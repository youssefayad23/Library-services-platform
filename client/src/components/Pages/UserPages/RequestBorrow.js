import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Footer from "../../../shared/Pages/Footer";
import Header from "../../../shared/Pages/Header";
import "../../Style/Contact.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

const Borrowed = (props) => {
  const navigate = useNavigate();
  const localStorage = window.localStorage;
  const location = useLocation();
  const ISBN = location.state?.ISBN;
  const id = localStorage.getItem("id");
  const [show, setShow] = useState(false);
  const [values, setValues] = useState({
    ISBN: "",
    title: "",
  });
  const sendRequest = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      `http://localhost:4000/add-book-request/${id}&${ISBN}`
    );
    if (res.status == 406) {
      alert("you cannot borrowed this book");
    } else {
      alert("send requset successfuly");
    }
  };
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
    const getAllDetails = async (ISBN) => {
      const res = await axios.get(
        `http://localhost:4000/book/book-by-ISBN/${ISBN}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.message == "found") {
        const { ISBN, title } = res.data.data[0];
        setValues({
          ISBN: ISBN,
          title: title,
        });
      }
    };
    getAllDetails(ISBN);
  }, []);
  return (
    <>
      {show ? (
        <Alert variant="success" onClose={() => setShow(false)} dismissible>
          Book Delete
        </Alert>
      ) : (
        ""
      )}
      <Header />
      <div id="contact" className="contact-area section-padding">
        <div className="container">
          <div className="section-title text-center m-4">
            <h1>Borrow Request</h1>
          </div>
          <div className="row">
            <div className="col-lg-7">
              <div className="contact">
                <Form>
                  <Form.Group className="mb-3 " controlId="formBasicBookISBN">
                    <Form.Control
                      type="number"
                      placeholder="Book ISBN"
                      readOnly
                      onChange={(e) => {
                        setValues({ ...values, author: e.target.value });
                      }}
                      value={values.ISBN}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3 " controlId="formBasicBookTitle">
                    <Form.Control
                      type="text"
                      placeholder="Book Title"
                      readOnly
                      onChange={(e) => {
                        setValues({ ...values, title: e.target.value });
                      }}
                      value={values.title}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      value={localStorage.getItem("email")}
                      readOnly
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    className="btn btn-contact-bg mb-5"
                    onClick={sendRequest}
                  >
                    Submit
                  </Button>
                </Form>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="single_address">
                <i className="fa fa-map-marker"></i>
                <h4>Our Address</h4>
                <p>3481 Melrose Place, Beverly Hills</p>
              </div>
              <div className="single_address">
                <i className="fa fa-envelope"></i>
                <h4>Send your message</h4>
                <p>Info@example.com</p>
              </div>
              <div className="single_address">
                <i className="fa fa-phone"></i>
                <h4>Call us on</h4>
                <p>(+1) 517 397 7100</p>
              </div>
              <div className="single_address">
                <i className="fa fa-clock-o"></i>
                <h4>Work Time</h4>
                <p>Mon - Fri: 08.00 - 16.00. Sat: 10.00 - 14.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Borrowed;
