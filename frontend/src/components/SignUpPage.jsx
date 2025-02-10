import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { Button, Form, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { login } from '../store/authSlice.js';

const SignUpPage = () => {
  const { t } = useTranslation('auth', 'errors');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputEl = useRef(null);

  useEffect(() => {
	 inputEl.current.focus();
  }, []);

  const validationSchema = yup.object({
    username: yup
      .string()
      .min(3, t('errorUsernameShort'))
      .max(20, t('errorUsernameLong'))
      .required(t('usernameRequired')),
    password: yup
      .string()
      .min(6, t('errorPasswordShort'))
      .required(t('passwordRequired')),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], t('errorPasswordsMatch'))
      .required(t('confirmPasswordRequired')),
  });

  const formik = useFormik({
    initialValues: { username: '', password: '', confirmPassword: '' },
    validationSchema,
    onSubmit: async (values) => {
      setErrorMessage('');
      try {
        const response = await axios.post('/api/v1/signup', {
          username: values.username,
          password: values.password,
        });
        const { token } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('username', values.username);
        dispatch(login(token));
        navigate('/');
      } catch (error) {
		  if (axios.isAxiosError(error)) {
			 setErrorMessage(t('axiosError'));
			 inputEl.current.select();
          toast.error(t('axiosError'));
          return; 
		  } else if (error.response?.status === 409) {
          setErrorMessage(t('errorUsernameExists'));
			 inputEl.current.select();
        } else {
          setErrorMessage(t('errorTryLater'));
        }
      }
    },
  });

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 text-light">
      <Row className="w-100">
        <Col xs={12} sm={8} md={6} lg={4} className="mx-auto">
          <h1 className="text-center mb-4">{t('signup')}</h1>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>{t('username')}</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder={t('username')}
                autoComplete="off"
					 ref={inputEl}
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.username && !!formik.errors.username}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.username}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>{t('password')}</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder={t('enterPassword')}
                autoComplete="off"
					 ref={inputEl}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.password && !!formik.errors.password}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>{t('confirmPassword')}</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder={t('enterConfirmPassword')}
                autoComplete="off"
					 ref={inputEl}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.confirmPassword}</Form.Control.Feedback>
            </Form.Group>
            <div className="d-grid">
              <Button variant="primary" type="submit">{t('signupButton')}</Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpPage;
