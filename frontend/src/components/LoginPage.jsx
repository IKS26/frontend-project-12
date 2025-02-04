import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field } from 'formik';
import { Container, Row, Col, Button, Alert, Form as BootstrapForm } from 'react-bootstrap';
import { login } from '../store/authSlice.js';

const LoginPage = () => {
  const { t } = useTranslation('auth');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('/api/v1/login', values);
      const { token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('username', values.username);
      dispatch(login(token));
      navigate('/');
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMessage(t('errorInvalidCredentials'));
      } else {
        setErrorMessage(t('errorTryLater'));
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 text-light">
      <Row className="w-100">
        <Col xs={12} sm={8} md={6} lg={4} className="mx-auto">
          <h1 className="text-center mb-4">{t('login')}</h1>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Formik initialValues={{ username: '', password: '' }} onSubmit={handleSubmit}>
            {({ handleChange, handleBlur }) => (
              <Form as={BootstrapForm}>
                <BootstrapForm.Group className="mb-3" controlId="username">
                  <BootstrapForm.Label>{t('username')}</BootstrapForm.Label>
                  <Field
                    as={BootstrapForm.Control}
                    name="username"
                    type="text"
                    placeholder={t('enterUsername')}
                    autoComplete="username"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </BootstrapForm.Group>
                <BootstrapForm.Group className="mb-3" controlId="password">
                  <BootstrapForm.Label>{t('password')}</BootstrapForm.Label>
                  <Field
                    as={BootstrapForm.Control}
                    name="password"
                    type="password"
                    placeholder={t('enterPassword')}
                    autoComplete="current-password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </BootstrapForm.Group>
                <div className="d-grid">
                  <Button variant="primary" type="submit">{t('loginButton')}</Button>
                </div>
              </Form>
            )}
          </Formik>
          <div className="card-footer p-4">
            <div className="text-center text-yellow">
              <span>{t('noAccount')} </span>
              <Link to="/signup" className="text-yellow">{t('signup')}</Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
