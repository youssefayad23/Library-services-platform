import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import AdminHeader from '../../../shared/Pages/AdminHeader.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const AddBook = () => {
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  const [values, setValues] = useState({
    ISBN: '',
    title: '',
    author: '',
    subject: '',
    rackNumber: '',
  });
  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: [event.target.value],
    }));
  };
  const [file, setFile] = useState('');
  const setfile = (e) => {
    setFile(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === true) {
      e.preventDefault();
      let formData = new FormData();
      formData.append('photo', file);
      formData.append('ISBN', values.ISBN);
      formData.append('title', values.title);
      formData.append('author', values.author);
      formData.append('subject', values.subject);
      formData.append('description', values.description);
      formData.append('rackNumber', values.rackNumber);
      if (
        file &&
        values.ISBN != '' &&
        values.title != '' &&
        values.description != '' &&
        values.author != '' &&
        values.rackNumber != '' &&
        values.subject != ''
      ) {
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            'Access-Control-Allow-Headers':
              'append,delete,entries,foreach,get,has,keys,set,values,Authorization',
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            userid: `${localStorage.getItem('id')}`,
          },
        };
        const res = await axios.post(
          'http://localhost:4000/book/add-new-book',
          formData,
          config
        );
        if (res.status == 200) {
          alert('Added Successfuly.');
          navigate('/admin/book/manage');
        } else {
          alert('Something Wrong.');
        }
        e.stopPropagation();
      }
    }

    setValidated(true);
  };
  return (
    <>
      <AdminHeader />
      <div className="container mt-3">
        <h1>Upload Book</h1>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="validationAuthor">
            <Form.Label>ISBN</Form.Label>
            <Form.Control
              required
              type="number"
              name="ISBN"
              onChange={(e) => {
                setValues({ ...values, ISBN: e.target.value });
              }}
              value={values.ISBN}
            />
            <Form.Control.Feedback type="invalid">
              Please Enter ISBN.
            </Form.Control.Feedback>
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
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
              type="number"
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
          <Form.Group className="mb-3" controlId="formBasicDescription">
            <Form.Label>Select Book Image</Form.Label>
            <Form.Control
              type="file"
              name="photo"
              onChange={setfile}
              required
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            className="mb-5"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Form>
      </div>
    </>
  );
};

export default AddBook;
