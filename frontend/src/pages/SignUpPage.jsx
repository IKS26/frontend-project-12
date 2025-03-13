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
import apiRoutes from '../api/apiRoutes.js';
import routes from '../routes/routes.js';

const SignUpPage = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputEl = useRef(null);

  useEffect(() => {
    inputEl.current?.focus();
  }, []);

  const validationSchema = yup.object({
    username: yup.string().min(3, t('errorUsernameShort')).max(20, t('errorUsernameLong')).required(t('usernameRequired')),
    password: yup.string().min(6, t('errorPasswordShort')).required(t('passwordRequired')),
    confirmPassword: yup.string().oneOf([yup.ref('password')], t('errorPasswordsMatch')).required(t('confirmPasswordRequired')),
  });

  const formik = useFormik({
    initialValues: { username: '', password: '', confirmPassword: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await axios.post(apiRoutes.signUp, {
          username: values.username,
          password: values.password,
        });
        const { token, username } = response.data;

        dispatch(login({ token, username }));
        navigate(routes.main);
      } catch (error) {
        if (error.response?.status === 409) {
          setErrors({ username: t('errorUsernameExists') });
        } else {
          setErrors({ confirmPassword: t('axiosError') });
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
          <Card className="shadow-sm signup-card">
            <Card.Body className="row p-5 d-flex flex-column flex-md-row justify-content-around align-items-center">
              <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
                <img src="/assets/avaSignUp.jpg" className="rounded-circle signup-avatar" alt={t('signup')} />
              </Col>
              <Col as="form" onSubmit={formik.handleSubmit} className="w-50">
                <h1 className="text-center mb-4">{t('signup')}</h1>
                <BootstrapForm.Group className="form-floating mb-3">
                  <BootstrapForm.Control
                    id="username"
                    type="text"
                    name="username"
                    placeholder={t('enterUsername')}
                    autoComplete="username"
                    ref={inputEl}
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.username && !!formik.errors.username}
                    required
                  />
                  <BootstrapForm.Label htmlFor="username">{t('username')}</BootstrapForm.Label>
                  <BootstrapForm.Control.Feedback type="invalid" tooltip>
                    {formik.errors.username}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>

                <BootstrapForm.Group className="form-floating mb-3">
                  <BootstrapForm.Control
                    id="password"
                    type="password"
                    name="password"
                    placeholder={t('enterPassword')}
                    autoComplete="new-password"
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

                <BootstrapForm.Group className="form-floating mb-4">
                  <BootstrapForm.Control
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder={t('enterConfirmPassword')}
                    autoComplete="new-password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
                    required
                  />
                  <BootstrapForm.Label htmlFor="confirmPassword">{t('confirmPassword')}</BootstrapForm.Label>
                  <BootstrapForm.Control.Feedback type="invalid" tooltip>
                    {formik.errors.confirmPassword}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>

                <Button type="submit" className="w-100 btn-outline-primary" disabled={formik.isSubmitting}>
                  {t('signupButton')}
                </Button>
              </Col>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span className="me-1">{t('haveAccount')}</span>
                <Link to={routes.login} className="text-yellow">{t('login')}</Link>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpPage;
