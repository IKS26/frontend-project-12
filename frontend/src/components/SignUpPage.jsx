import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { Button, Form, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import * as yup from 'yup';
import { login } from '../store/authSlice.js';

const SignUpPage = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validationSchema = yup.object({
    username: yup.string().min(3, 'Имя пользователя должно быть не менее 3 символов').max(20, 'Имя пользователя должно быть не более 20 символов').required('Имя пользователя обязательно'),
    password: yup.string().min(6, 'Пароль должен быть не менее 6 символов').required('Пароль обязателен'),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Пароли должны совпадать').required('Подтверждение пароля обязательно'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
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
        if (error.response?.status === 409) {
          setErrorMessage('Имя пользователя уже существует');
        } else {
          setErrorMessage('Что-то пошло не так. Пожалуйста, попробуйте позже.');
        }
      }
    },
  });

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 text-light">
      <Row className="w-100">
        <Col xs={12} sm={8} md={6} lg={4} className="mx-auto">
          <h1 className="text-center mb-4">Регистрация</h1>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Имя пользователя</Form.Label>
              <Form.Control
                type="text"
                name="username"
					 placeholder="Придумайте ваше имя пользователя"
                value={formik.values.username}
                autoComplete="off"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.username && !!formik.errors.username}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.username}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                name="password"
					 placeholder="Придумайте ваш пароль"
                value={formik.values.password}
                autoComplete="off"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.password && !!formik.errors.password}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Подтвердите пароль</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
					 placeholder="Подтвердите ваш пароль"
                value={formik.values.confirmPassword}
                autoComplete="off"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
              />
              <Form.Control.Feedback type="invalid">{formik.errors.confirmPassword}</Form.Control.Feedback>
            </Form.Group>
            <div className="d-grid">
              <Button variant="primary" type="submit">Зарегистрироваться</Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpPage;
