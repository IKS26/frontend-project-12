import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { Container, Row, Col, Button, Alert, Form as BootstrapForm } from 'react-bootstrap';

const LoginPage = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('/api/v1/login', values);
      const { token } = response.data;
		
      localStorage.setItem('token', token);
      navigate('/');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage('Invalid username or password');
      } else {
        setErrorMessage('Something went wrong. Please try again later.');
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row className="w-100">
        <Col xs={12} sm={8} md={6} lg={4} className="mx-auto">
          <h1 className="text-center mb-4">Login Page</h1>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Formik
            initialValues={{ username: '', password: '' }}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleBlur }) => (
              <Form as={BootstrapForm}>
                <BootstrapForm.Group className="mb-3" controlId="username">
                  <BootstrapForm.Label>Username</BootstrapForm.Label>
                  <Field
                    as={BootstrapForm.Control}
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </BootstrapForm.Group>
                <BootstrapForm.Group className="mb-3" controlId="password">
                  <BootstrapForm.Label>Password</BootstrapForm.Label>
                  <Field
                    as={BootstrapForm.Control}
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </BootstrapForm.Group>
                <div className="d-grid">
                  <Button variant="primary" type="submit">
                    Login
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
