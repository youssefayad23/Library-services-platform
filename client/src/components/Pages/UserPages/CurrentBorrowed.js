import React, { useEffect, useState } from 'react';
import Footer from '../../../shared/Pages/Footer.js';
import Header from '../../../shared/Pages/Header.js';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const CurrentBorrowed = () => {
  const navigate = useNavigate();
  const userID = window.localStorage.getItem('id');
  const [data, setData] = useState([]);

  const getCurrentBorrowed = async () => {
    const res = await axios.get(
      `http://localhost:4000/currentApproval/${userID}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (res.data.message == 'user history') {
      setData(res.data.data);
    }
  };
  let limits = window.localStorage.getItem('limits');
  const returnBook = async (userID, ISBN, startDate, endDate) => {
    try {
      const res = await axios.put(
        `http://localhost:4000/returnBook/${userID}&${ISBN}&${limits}&${startDate}&${endDate}`
      );
      if (res.data.message == 'returned successfully') {
        alert('returned Successfully.');
        navigate('/books');
        localStorage.setItem('limits', limits + 1);
      }
    } catch (error) {
      if (error.response.data.message == 'error') {
        alert('returned Successfully.');
        navigate('/books');
        localStorage.setItem('limits', parseInt(limits) + 1);
      }
    }
  };
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
    }
    getCurrentBorrowed();
  }, []);
  return (
    <>
      <Header />
      <div className="container mt-2">
        <h1 className="text-center mt-2">Current Borrowed</h1>
        <div className="d-flex justify-content-between align-content-start flex-wrap m-3">
          {data.length > 0
            ? data.map((el, i) => {
                return (
                  <>
                    <Card
                      style={{ width: '30rem', height: '31.5em' }}
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
                        <div className="d-flex justify-content-around text-center">
                          <Button
                            variant="success"
                            size="lg"
                            onClick={() => {
                              returnBook(
                                el.user_id,
                                el.book_ISBN,
                                el.book_startDate,
                                el.book_endDate
                              );
                            }}
                          >
                            Return
                          </Button>
                        </div>
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
export default CurrentBorrowed;
