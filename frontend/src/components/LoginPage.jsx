import React from 'react';
import { Formik, Form, Field } from 'formik';

const LoginPage = () => {
  return (
    <div>
      <h1>LoginPage</h1>
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {() => (
          <Form>
            <div>
              <label htmlFor="username">Username</label>
              <Field id="username" name="username" placeholder="Username" />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <Field id="password" name="password" type="password" placeholder="Password" />
            </div>
            <button type="submit">Login</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;