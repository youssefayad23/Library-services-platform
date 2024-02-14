import React, { useEffect, useState } from 'react';
import Footer from '../../../shared/Pages/Footer.js';
import Header from '../../../shared/Pages/Header.js';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const BorrowedHistory = () => {
  const navigate = useNavigate();
  const userID = window.localStorage.getItem('id');
  const [data, setData] = useState([]);

  const getHistory = async () => {
    const res = await axios.get(`http://localhost:4000/history/${userID}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.data.message == 'user history') {
      setData(res.data.data);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
    }
    getHistory();
  }, []);
  return (
    <>
      <Header />
      <div className="container mt-2">
        <h1 className="text-center mt-2">Borrowed History</h1>
        <div className="d-flex justify-content-between align-content-start flex-wrap m-3">
          {data.length > 0
            ? data.map((el, i) => {
                return (
                  <>
                    <Card
                      style={{ width: '30rem', height: '28em' }}
                      className="mb-3"
                    >
                      <Card.Img
                        variant="top"
                        src={`${el.book_img_url}`}
                        style={{
                          width: '100px',
                          textAlign: 'center',
                          margin: 'auto',
                        }}
                        className="mt-2"
                      />
                      <Card.Body className=" lg-3 align-content-start justify-content-start">
                        <Card.Title>Title : {el.book_title}</Card.Title>
                        <Card.Text>Author :{el.book_author}</Card.Text>
                        <Card.Text>ISBN : {el.book_ISBN}</Card.Text>
                        <Card.Text>Subject : {el.book_subject}</Card.Text>
                        {/* <Card.Text>Description :{el.description}</Card.Text>
                        <Card.Text>Rack Number :{el.rackNumber}</Card.Text> */}
                        <Card.Text>
                          Status : <b>{el.status}</b>
                        </Card.Text>
                        <Card.Text>Borrow Date : {el.book_startDate}</Card.Text>
                        <Card.Text>Return Date : {el.book_endDate}</Card.Text>
                      </Card.Body>
                    </Card>
                  </>
                );
              })
            : ''}
        </div>
      </div>
      <Footer />
    </>
  );
};
export default BorrowedHistory;
