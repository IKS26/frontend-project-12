import React from 'react';
import { BsArrowRightSquare } from 'react-icons/bs';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const MessageInput = ({ handleSendMessage, isSending }) => {
  const formik = useFormik({
    initialValues: {
      message: '',
    },
    validationSchema: Yup.object({
      message: Yup.string().trim().required('Сообщение не может быть пустым'),
    }),
    onSubmit: (values, { resetForm }) => {
      console.log('Отправка сообщения с submit:', values.message);
      handleSendMessage(values.message);
      resetForm();
    },
  });

  return (
    <div className="mt-auto px-5 py-3">
      <form onSubmit={formik.handleSubmit} noValidate className="py-1 border rounded-2">
        <div className="input-group has-validation">
          <input
            name="message"
            aria-label="Новое сообщение"
            placeholder="Введите сообщение..."
            value={formik.values.message}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`border-1 p-0 ps-2 form-control input-message-bg ${
              formik.errors.message && formik.touched.message ? 'is-invalid' : ''
            }`}
            disabled={isSending}
          />
          {formik.touched.message && formik.errors.message && (
            <div className="invalid-feedback">{formik.errors.message}</div>
          )}
          <button type="submit" className="btn btn-group-vertical" disabled={isSending}>
            <BsArrowRightSquare size={20} />
            <span className="visually-hidden">Отправить</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
