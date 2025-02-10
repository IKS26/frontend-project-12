import React, { startTransition } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Modal as BootstrapModal, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import leoProfanity from 'leo-profanity';
import { selectAllChannelNames, setCurrentChannelId } from '../../store/channelsSlice.js';
import { useAddChannelMutation } from '../../services/dataApi';

const AddChannelModal = ({ handleClose }) => {
  const { t } = useTranslation('modals');
  const dispatch = useDispatch();
  const channelNames = useSelector(selectAllChannelNames);
  const [addChannel, { isLoading }] = useAddChannelMutation();

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .required(t('addChannel.validation.required'))
      .min(3, t('addChannel.validation.minMax'))
      .max(20, t('addChannel.validation.minMax'))
      .notOneOf(channelNames, t('addChannel.validation.unique')),
  });

  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (leoProfanity.check(values.name)) {
        toast.error(t('addChannel.validation.errorProfanityChannelName'));
      }

      startTransition(async () => {
        const cleanName = leoProfanity.clean(values.name);
        setSubmitting(true);
        try {
          const newChannel = await addChannel({ name: cleanName }).unwrap();
          if (newChannel?.id) {
            dispatch(setCurrentChannelId(newChannel.id));
          }
          toast.success(
				  t('addChannel.created')
         //   <div dangerouslySetInnerHTML={{ __html: t('addChannel.success', { newChannelName: cleanName }) }} />
          );
          handleClose();
          resetForm();
        } catch {
          toast.error(t('addChannel.error'));
        } finally {
          setSubmitting(false);
        }
      });
    },
  });

  return (
    <>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>{t('addChannel.title')}</BootstrapModal.Title>
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
              placeholder={t('addChannel.placeholder')}
              disabled={isLoading}
            />
            <Form.Label className='visually-hidden' htmlFor='name'>{t('addChannel.name')}</Form.Label>
            {formik.errors.name && 
              <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback> 
            }
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              {t('addChannel.cancel')}
            </Button>
            <Button variant="primary" type="submit" disabled={formik.isSubmitting || isLoading}>
              {t('addChannel.submit')}
            </Button>
          </div>
        </Form>
      </BootstrapModal.Body>
    </>
  );
};

export default AddChannelModal;
