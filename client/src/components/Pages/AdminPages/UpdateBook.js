import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import AdminHeader from '../../../shared/Pages/AdminHeader.js';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateBook = () => {
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const ISBN = useParams();
  const [values, setValues] = useState({
    ISBN: '',
    title: '',
    author: '',
    subject: '',
    rackNumber: '',
    description: '',
  });
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      values.title != '' &&
      values.description != '' &&
      values.author != '' &&
      values.rackNumber != '' &&
      values.subject != ''
    ) {
      console.log(values);
      const res = await axios({
        method: 'put',
        url: `http://localhost:4000/admin/update-book/${ISBN.ISBN}&${values.title}&${values.description}&${values.author}&${values.rackNumber}&${values.subject}`,
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

      console.log(res);
      if (res.status == 200) {
        alert('Update Successfuly.');
        navigate('/admin/book/manage');
      } else {
        alert('Something Wrong.');
      }
    }

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };
  useEffect(() => {
    const getAllDetails = async (ISBN) => {
      const res = await axios.get(
        `http://localhost:4000/book/book-by-ISBN/${ISBN}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            'Access-Control-Allow-Headers':
              'append,delete,entries,foreach,get,has,keys,set,values,Authorization',
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            userid: `${localStorage.getItem('id')}`,
          },
        }
      );
      if (res.data.message == 'found') {
        const { ISBN, title, author, subject, rackNumber, description } =
          res.data.data[0];
        setValues({
          ISBN: ISBN,
          title: title,
          author: author,
          subject: subject,
          rackNumber: rackNumber,
          description: description,
        });
      }
    };
    getAllDetails(ISBN.ISBN);
  }, []);
  return (
    <>
      <AdminHeader />
      <div className="container mt-3">
        <h1>Upload Book</h1>
        {
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="validationISBN">
              <Form.Label>ISBN</Form.Label>
              <Form.Control
                type="namber"
                name="ISBN"
                //onChange={handleInput}
                required
                value={values.ISBN}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="validationAuthor">
              <Form.Label>Author</Form.Label>
              <Form.Control
                required
                type="text"
                name="author"
                onChange={(e) => {
                  setValues({ ...values, author: e.target.value });
                }}
                value={values.author}
              />
              <Form.Control.Feedback type="invalid">
                Please Enter an Author Name.
              </Form.Control.Feedback>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="validationTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                onChange={(e) => {
                  setValues({ ...values, title: e.target.value });
                }}
                value={values.title}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please Enter The Title.
              </Form.Control.Feedback>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="validationRackNumber">
              <Form.Label>Rack Number</Form.Label>
              <Form.Control
                type="text"
                name="rackNumber"
                onChange={(e) => {
                  setValues({ ...values, rackNumber: e.target.value });
                }}
                value={values.rackNumber}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please Enter The Rack Number.
              </Form.Control.Feedback>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="validationSubject">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                name="subject"
                onChange={(e) => {
                  setValues({ ...values, subject: e.target.value });
                }}
                value={values.subject}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please Enter The Subject.
              </Form.Control.Feedback>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="validationDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                onChange={(e) => {
                  setValues({ ...values, description: e.target.value });
                }}
                value={values.description}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please Enter The Description.
              </Form.Control.Feedback>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>

            {/* <Form.Group className="mb-3" controlId="formBasicFile">
              <Form.Label>Select Your Image</Form.Label>
              <Form.Control
                type="file"
                name="photo"
                onChange={setfile}
                required
              />
            </Form.Group> */}
            <Button
              variant="primary"
              type="submit"
              className="mb-5"
              onClick={handleSubmit}
            >
              Update
            </Button>
          </Form>
        }
      </div>
    </>
  );
};

export default UpdateBook;
