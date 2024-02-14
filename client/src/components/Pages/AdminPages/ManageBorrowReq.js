import React, { useEffect, useState } from 'react';
import AdminHeader from '../../../shared/Pages/AdminHeader.js';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const config = {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    'Access-Control-Allow-Headers':
      'append,delete,entries,foreach,get,has,keys,set,values,Authorization',
    'Content-Type': 'multipart/form-data',
    authorization: `Bearer ${localStorage.getItem('token')}`,
    userid: `${localStorage.getItem('id')}`,
  },
};

const ManageBorrowedReq = () => {
  const navigate = useNavigate();
  const [rernder, setRernder] = useState();
  const [data, setData] = useState([]);
  const [date, setDate] = useState({
    startDate: '',
    endDate: '',
  });
  const getAllRequest = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/admin/all-borrowed-request`,
        config
      );
      if (res.data.message == 'there found some requests') {
        setData(res.data.data);
      }
      if (res.data.message == 'there not found any requests.') {
        setData(res.data.data);
      }
    } catch (error) {
      setRernder(error);
      if (error.response.data.message == 'there not found any requests.') {
      }
    }
  };

  const approvalRequests = async (userID, ISBN, startDate, endDate) => {
    try {
      const res = await axios({
        method: 'put',
        url: `http://localhost:4000/admin/aprove-borrowed-request/${userID}&${ISBN}&${startDate}&${endDate}`,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          'Access-Control-Allow-Headers':
            'append,delete,entries,foreach,get,has,keys,set,values,Authorization',
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${localStorage.getItem('token')}`,
          userid: `${localStorage.getItem('id')}`,
        },
      });
      if (res.status == 200) {
        alert('Approval Successfully.');
        navigate('/admin/book/manage');
      } else {
        alert('Something Wrong.');
      }
    } catch (error) {
      if (error.response.data.message == 'Not Allowed') {
        alert('His Limit = 0');
      }
    }
  };

  const rejectRequest = async (id, ISBN) => {
    const res = await axios({
      method: 'delete',
      url: `http://localhost:4000/admin/reject-borrowed-request/${id}&${ISBN}`,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Access-Control-Allow-Headers':
          'append,delete,entries,foreach,get,has,keys,set,values,Authorization',
        'Content-Type': 'multipart/form-data',
        authorization: `Bearer ${localStorage.getItem('token')}`,
        userid: `${localStorage.getItem('id')}`,
      },
    });
    if (res.status == 202) {
      getAllRequest();
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
    }
    getAllRequest();
  }, []);
  return (
    <>
      <AdminHeader />
      <div className="container mt-2">
        <h1 className="text-center mt-2 mb-5">Manage Borrowed Requests</h1>
        <div className="d-flex justify-content-between align-content-start flex-wrap m-3 ">
          {data.length > 0
            ? data.map((el, i) => {
                return (
                  <>
                    <Card
                      style={{ width: '22rem', height: '30rem' }}
                      className="mb-3"
                    >
                      <Card.Header>
                        <div className="d-flex justify-content-around text-center">
                          <Card.Img
                            variant="top"
                            src={`${el.img_url}`}
                            style={{
                              width: '100px',
                              height: '121.438px',
                              textAlign: 'center',
                              margin: 'auto',
                            }}
                            className="mt-2"
                          />
                        </div>
                      </Card.Header>
                      <Card.Body /* className="text-center" */>
                        <Card.Title>User Name : {el.name}</Card.Title>
                        <Card.Text>User Email : {el.email}</Card.Text>
                        <Card.Title>Book Title : {el.title}</Card.Title>
                        <Card.Text>Book ISPN : {el.ISBN}</Card.Text>
                        <div className="d-flex justify-content-between text-center mb-3">
                          <label
                            for="html5-date-input"
                            className="col-form-label"
                          >
                            start Date : {el.startDate}
                          </label>
                          <div className="col-md-8">
                            <input
                              className="form-control"
                              type="date"
                              id="html5-date-input"
                              name="stertDate"
                              onChange={(e) => {
                                setDate({
                                  ...date,
                                  startDate: e.target.value,
                                });
                              }}
                            ></input>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between text-center mb-3">
                          <label
                            for="html5-date-input"
                            className="col-form-label"
                          >
                            Return Date :{el.endDate}
                          </label>
                          <div className="col-md-8">
                            <input
                              className="form-control"
                              type="date"
                              id="html5-date-input"
                              name="endDate"
                              onChange={(e) => {
                                setDate({
                                  ...date,
                                  endDate: e.target.value,
                                });
                              }}
                            ></input>
                          </div>
                        </div>
                        <Card.Footer>
                          <div className="d-flex justify-content-around text-center">
                            <Button
                              variant="success"
                              size="lg"
                              onClick={(e) => {
                                //e.preventDefault();
                                approvalRequests(
                                  el.id,
                                  el.ISBN,
                                  date.startDate,
                                  date.endDate
                                );
                              }}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="danger"
                              size="lg"
                              onClick={(e) => {
                                rejectRequest(el.id, el.ISBN);
                              }}
                            >
                              Reject
                            </Button>
                          </div>
                        </Card.Footer>
                      </Card.Body>
                    </Card>
                  </>
                );
              })
            : ''}
        </div>
      </div>
    </>
  );
};

export default ManageBorrowedReq;
