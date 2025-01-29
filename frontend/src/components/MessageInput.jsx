import React from 'react';
import * as Yup from 'yup';
import { BsArrowRightSquare } from 'react-icons/bs';
import { useFormik } from 'formik';
import { useSendMessageMutation } from '../services/dataApi';

const MessageInput = ({ currentChannelId }) => {
  const [sendMessage, { isLoading }] = useSendMessageMutation();

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    validationSchema: Yup.object({
      message: Yup.string().trim().required('Сообщение не может быть пустым'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await sendMessage({
          body: values.message,
          channelId: currentChannelId,
        });
        resetForm();
      } catch (err) {
        console.error('Ошибка отправки сообщения:', err);
      }
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
            disabled={isLoading}
          />
          {formik.touched.message && formik.errors.message && (
            <div className="invalid-feedback">{formik.errors.message}</div>
          )}
          <button type="submit" className="btn btn-group-vertical" disabled={isLoading}>
            <BsArrowRightSquare size={20} />
            <span className="visually-hidden">Отправить</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
