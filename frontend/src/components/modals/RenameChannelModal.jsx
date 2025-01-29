import React, { useEffect, useRef } from 'react';
import { Modal as BootstrapModal, Form, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import leoProfanity from 'leo-profanity';
import { selectChannelById } from '../../store/channelsSlice.js';
import { selectModalState } from '../../store/modalSlice.js';
import { useFetchChannelsQuery, useRenameChannelMutation } from '../../services/dataApi';

const RenameChannelModal = ({ handleClose }) => {
  const { data: channels, isLoading } = useFetchChannelsQuery();
  const { channelId } = useSelector(selectModalState);
  const currentChannel = useSelector((state) => selectChannelById(state, channelId));

  if (!channels || !currentChannel) return null;

  const [renameChannel] = useRenameChannelMutation();
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .required('Имя канала обязательно')
      .min(3, 'Имя канала должно быть от 3 до 20 символов')
      .max(20, 'Имя канала должно быть от 3 до 20 символов')
      .notOneOf(channels.map((ch) => ch.name), 'Канал с таким именем уже существует'),
  });

  const formik = useFormik({
    initialValues: { name: currentChannel.name },
    validationSchema,
    onSubmit: async ({ name }) => {
      const cleanName = leoProfanity.clean(name);
      try {
        await renameChannel({ id: channelId, name: cleanName }).unwrap();
        toast.success('Канал переименован');
        handleClose();
      } catch (error) {
        toast.error('Не удалось переименовать канал');
      }
    },
  });

  return (
    <>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>Переименовать канал</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              ref={inputRef}
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.name && !!formik.errors.name}
              placeholder="Введите новое имя"
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
              Сохранить
            </Button>
          </div>
        </Form>
      </BootstrapModal.Body>
    </>
  );
};

export default RenameChannelModal;