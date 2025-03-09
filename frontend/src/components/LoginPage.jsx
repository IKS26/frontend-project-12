/* eslint-disable object-curly-newline */
import React, { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Button, Form as BootstrapForm, Card } from 'react-bootstrap';
import axios from 'axios';
import * as yup from 'yup';
import { login } from '../store/authSlice.js';
import avaLogin from '../assets/avaLogin.jpg';

const LoginPage = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputEl = useRef(null);
  

  useEffect(() => {
    inputEl.current?.focus();
  }, []);

  const validationSchema = yup.object({
    username: yup.string().required(t('usernameRequired')),
    password: yup.string().required(t('passwordRequired')),
  });

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await axios.post('/api/v1/login', values);
        const { token, username } = response.data;

        dispatch(login({ token, username }));
        navigate('/');
      } catch (error) {
			if (error.response?.status === 401) {
			  setErrors({ 
				 username: t('errorInvalidCredentials'), 
				 password: t('errorInvalidCredentials') 
			  });
			} else if (error.request) { 
			  setErrors({ password: t('axiosError') });
			} else {
			  setErrors({ password: t('unexpectedError') });
			}
			inputEl.current?.select();
		} finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col xs={12} md={8} xxl={6}>
          <Card className="shadow-sm login-card">
            <Card.Body className="row p-5">
              <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
                <img src={avaLogin} className="rounded-circle login-avatar" alt={t('login')} />
              </Col>
              <Col as="form" onSubmit={formik.handleSubmit} className="w-50">
                <h1 className="text-center mb-4">{t('login')}</h1>

                <BootstrapForm.Group className="form-floating mb-3">
                  <BootstrapForm.Control
                    type="text"
                    name="username"
                    placeholder={t('enterNickname')}
                    autoComplete="username"
                    ref={inputEl}
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.username && !!formik.errors.username}
                    required
                  />
                  <BootstrapForm.Label htmlFor="username">{t('nickname')}</BootstrapForm.Label>
                  <BootstrapForm.Control.Feedback type="invalid" tooltip>
                    {formik.errors.username}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>

                <BootstrapForm.Group className="form-floating mb-4">
                  <BootstrapForm.Control
                    type="password"
                    name="password"
                    placeholder={t('enterPassword')}
                    autoComplete="current-password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.password && !!formik.errors.password}
                    required
                  />
                  <BootstrapForm.Label htmlFor="password">{t('password')}</BootstrapForm.Label>
                  <BootstrapForm.Control.Feedback type="invalid" tooltip>
                    {formik.errors.password}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>

                <Button type="submit" className="w-100 mb-3 btn-outline-primary" disabled={formik.isSubmitting}>
                  {t('loginButton')}
                </Button>
              </Col>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>{t('noAccount')} </span>
                <Link to="/signup" className="text-yellow">{t('signup')}</Link>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
