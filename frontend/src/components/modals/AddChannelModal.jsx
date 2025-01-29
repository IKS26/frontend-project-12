import React from 'react';
import { Modal as BootstrapModal, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import leoProfanity from 'leo-profanity';
import { selectAllChannelNames } from '../../store/channelsSlice.js';
import { useAddChannelMutation } from '../../services/dataApi';

const AddChannelModal = ({ handleClose }) => {
  const channelNames = useSelector(selectAllChannelNames);
  const [addChannel, { isLoading }] = useAddChannelMutation();

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .required('Имя канала обязательно')
      .min(3, 'Имя канала должно быть от 3 до 20 символов')
      .max(20, 'Имя канала должно быть от 3 до 20 символов')
      .notOneOf(channelNames, 'Канал с таким именем уже существует'),
  });

  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const cleanName = leoProfanity.clean(values.name);
      setSubmitting(true);
      try {
        await addChannel({ name: cleanName }).unwrap();
        toast.success('Канал добавлен');
        console.log('Канал добавлен');
        handleClose();
        resetForm();
      } catch (error) {
        toast.error('Не удалось добавить канал');
        console.error('Ошибка при добавлении канала:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>Добавить канал</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.name && !!formik.errors.name}
              placeholder="Введите имя канала"
              disabled={isLoading}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Отмена
            </Button>
            <Button variant="primary" type="submit" disabled={formik.isSubmitting || isLoading}>
              Добавить
            </Button>
          </div>
        </Form>
      </BootstrapModal.Body>
    </>
  );
};

export default AddChannelModal;
