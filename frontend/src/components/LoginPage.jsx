import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field } from 'formik';
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Form as BootstrapForm
} from 'react-bootstrap';
import { login } from '../store/authSlice.js';

const LoginPage = () => {
  const { t } = useTranslation('auth', 'errors');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputEl = useRef(null);

  useEffect(() => {
    inputEl.current?.focus();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    setErrorMessage('');
    try {
      const response = await axios.post('/api/v1/login', values);
      const { token, username } = response.data;

      dispatch(login({ token, username }));
      navigate('/');
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMessage(t('errorInvalidCredentials'));
      } else {
        setErrorMessage(t('axiosError'));
      }
      inputEl.current?.select();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 text-light">
      <Row className="w-100">
        <Col xs={12} sm={8} md={6} lg={4} className="mx-auto">
          <h1 className="text-center mb-4">{t('login')}</h1>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Formik
            initialValues={{ username: '', password: '' }}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <BootstrapForm.Group className="mb-3" controlId="username">
                  <BootstrapForm.Label>{t('nickname')}</BootstrapForm.Label>
                  <Field
                    as={BootstrapForm.Control}
                    name="username"
                    type="text"
                    placeholder={t('enterNickname')}
                    autoComplete="username"
                    innerref={inputEl}
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
                  />
                </BootstrapForm.Group>
                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {t('loginButton')}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
          <div className="card-footer p-4 text-center">
            <span>{t('noAccount')} </span>
            <Link to="/signup" className="text-yellow">
              {t('signup')}
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
