import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal as BootstrapModal, Form, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import leoProfanity from 'leo-profanity';
import { selectAllChannelNames, setCurrentChannelId } from '../../store/channelsSlice.js';
import { useAddChannelMutation } from '../../api/dataApi.js';
import { addChannelValidationSchema } from '../../utils/validate.js';

const AddChannelModal = ({ handleClose }) => {
  const { t } = useTranslation('chat');
  const dispatch = useDispatch();
  const channelNames = useSelector(selectAllChannelNames);
  const [addChannel, { isLoading }] = useAddChannelMutation();
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus();
    }
  }, []);

  const validationSchema = addChannelValidationSchema(t, channelNames);

  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const cleanName = leoProfanity.clean(values.name);
      setSubmitting(true);

      try {
        const newChannel = await addChannel({ name: cleanName }).unwrap();
        if (newChannel?.id) {
          dispatch(setCurrentChannelId(newChannel.id));
        }
        toast.success(t('addChannel.created'));
        resetForm();
        handleClose();
      } catch (error) {
        toast.error(t('addChannel.error'));
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <BootstrapModal.Header closeButton className="modal-header-dark">
        <BootstrapModal.Title className="modal-title-dark">
          {t('addChannel.title')}
        </BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body className="modal-body-dark">
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="visually-hidden" htmlFor="name">
              {t('addChannel.name')}
            </Form.Label>
            <Form.Control
              type="text"
              id="name"
              name="name"
              ref={inputRef}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.name && !!formik.errors.name}
              placeholder={t('addChannel.placeholder')}
              disabled={isLoading}
              className="form-control-dark"
            />
            <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose} className="btn-secondary-dark me-2">
              {t('addChannel.cancel')}
            </Button>
            <Button variant="primary" type="submit" disabled={formik.isSubmitting || isLoading} className="btn-primary-dark">
              {t('addChannel.submit')}
            </Button>
          </div>
        </Form>
      </BootstrapModal.Body>
    </>
  );
};

export default AddChannelModal;
