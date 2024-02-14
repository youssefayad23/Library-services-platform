import React, { useEffect, useState } from 'react';
import AdminHeader from '../../../shared/Pages/AdminHeader.js';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';

const ManageBooks = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('');

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

  const getAllBooks = async () => {
    const res = await axios.get('http://localhost:4000/book', config);
    if (res.data.message == 'Get all books successfully.') {
      setData(res.data.data);
    }
  };
  const deleteBook = async (ISBN) => {
    const res = await axios({
      method: 'delete',
      url: `http://localhost:4000/admin/delete-book/${ISBN}`,
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
      getAllBooks();
      setShow(true);
    }
  };

  const handleSelect = (e) => {
    setFilter(e.target.value);
    let value = e.target.value;
    if (value == 'rackNumber') {
      let sort = data.sort((a, b) => (a.rackNumber > b.rackNumber ? 1 : -1));
      setData(sort);
    } else {
      let sort = data.sort((a, b) => (a.ISBN > b.ISBN ? 1 : -1));
      setData(sort);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
    }
    if (localStorage.getItem('type') == '0') {
      navigate('*');
    }
    getAllBooks();
  }, []);
  return (
    <>
      {show ? (
        <Alert variant="danger" onClose={() => setShow(false)} dismissible>
          Book Delete
        </Alert>
      ) : (
        ''
      )}
      <AdminHeader />
      <div className="container mt-2">
        <select name="dropdown" onChange={handleSelect}>
          <option value="ISBN" selected>
            ISBN
          </option>
          <option value="rackNumber">rack Number</option>
        </select>
        <h1 className="text-center mt-2">Manage Books</h1>
        <div className="text-end">
          <Button variant="primary">
            <NavLink
              to="/admin/book/add"
              className="text-decoration-none text-light"
            >
              Add Book
            </NavLink>
          </Button>
        </div>
        <div className="d-flex justify-content-between align-content-start flex-wrap m-3">
          {data.length > 0
            ? data.map((el, i) => {
                return (
                  <>
                    <Card
                      style={{ width: '33rem', height: 'auto' }}
                      className="mb-4"
                    >
                      <Card.Img
                        variant="top"
                        src={`${el.img_url}`}
                        style={{
                          width: '150px',
                          textAlign: 'center',
                          margin: 'auto',
                          height: '200px',
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

                        <div className=" d-flex justify-content-around text-center">
                          <Link to={`/admin/book/update/${el.ISBN}`}>
                            <Button
                              variant="secondary"
                              size="lg" /*  onClick={() => dltUser(el.id)} */
                            >
                              Update
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            size="lg"
                            onClick={() => deleteBook(el.ISBN)}
                          >
                            Delete
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
    </>
  );
};

export default ManageBooks;
