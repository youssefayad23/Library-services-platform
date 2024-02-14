import React, { useEffect, useState } from "react";
import Footer from "../../../shared/Pages/Footer.js";
import Header from "../../../shared/Pages/Header.js";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import "../../Style/searchBar.css";

const Books = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const getAllBooks = async () => {
    const res = await axios.get("http://localhost:4000/book/available-Books", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.data.message == "Get all books successfully.") {
      setData(res.data.data);
    }
  };

  const filteredData = data.filter((item) => {
    return (
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.author.toLowerCase().includes(query.toLowerCase()) ||
      item.subject.toLowerCase().includes(query.toLowerCase()) ||
      item.rackNumber.toString().toLowerCase().includes(query.toLowerCase()) ||
      item.ISBN.toString().toLowerCase().includes(query.toLowerCase())
    );
  });
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
    getAllBooks();
  }, []);
  return (
    <>
      <Header />
      <div className="container mt-2">
        <div className="container-input">
          <input
            type="text"
            placeholder="Search"
            name="text"
            className="input"
            onChange={(e) => setQuery(e.target.value)}
          ></input>
          <svg
            fill="#000000"
            width="20px"
            height="20px"
            viewBox="0 0 1920 1920"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="text-center mt-2"
              d="M790.588 1468.235c-373.722 0-677.647-303.924-677.647-677.647 0-373.722 303.925-677.647 677.647-677.647 373.723 0 677.647 303.925 677.647 677.647 0 373.723-303.924 677.647-677.647 677.647Zm596.781-160.715c120.396-138.692 193.807-319.285 193.807-516.932C1581.176 354.748 1226.428 0 790.588 0S0 354.748 0 790.588s354.748 790.588 790.588 790.588c197.647 0 378.24-73.411 516.932-193.807l516.028 516.142 79.963-79.963-516.142-516.028Z"
              fill-rule="evenodd"
            ></path>
          </svg>
        </div>

        <h1 className="text-center mt-2">Available Books</h1>
        <div className="d-flex justify-content-between align-content-start flex-wrap m-3">
          {data.length > 0
            ? filteredData.map((el, i) => {
                return (
                  <>
                    <Card
                      style={{ width: "33rem", height: "auto" }}
                      className="mb-4"
                    >
                      <Card.Img
                        variant="top"
                        src={`${el.img_url}`}
                        style={{
                          width: "150px",
                          textAlign: "center",
                          margin: "auto",
                        }}
                        className="mt-2"
                      />
                      <Card.Body /* className="text-center" */>
                        <Card.Title>Title : {el.title}</Card.Title>
                        <Card.Text>Author :{el.author}</Card.Text>
                        <Card.Text>ISBN :{el.ISBN}</Card.Text>
                        <Card.Text>Subject :{el.subject}</Card.Text>
                        <Card.Text>Description :{el.description}</Card.Text>
                        <Card.Text>Rack Number :{el.rackNumber}</Card.Text>
                        <div className="d-flex justify-content-around text-center">
                          <Link
                            to="/borrow/request/"
                            state={{ ISBN: `${el.ISBN}` }}
                          >
                            <Button variant="btn btn-success" size="lg">
                              Want to Borrow
                            </Button>
                          </Link>
                        </div>
                      </Card.Body>
                    </Card>
                  </>
                );
              })
            : ""}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Books;
