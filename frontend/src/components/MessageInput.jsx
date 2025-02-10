import React, { useRef, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import leoProfanity from 'leo-profanity';
import { useTranslation } from 'react-i18next';
import { BsArrowRightSquare } from 'react-icons/bs';
import { Form, Button } from 'react-bootstrap';
import { useSendMessageMutation } from '../services/dataApi';

const MessageInput = ({ currentChannelId }) => {
  const { t } = useTranslation('chat');
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentChannelId]);

  const formik = useFormik({
    initialValues: { message: '' },
    validationSchema: Yup.object({
      message: Yup.string().trim().required(t('messages.newMessage')),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (leoProfanity.check(values.message)) {
        toast.error(t('messages.errorProfanityDetected'));
        return;
      }

      try {
        const cleanMessage = leoProfanity.clean(values.message);
        await sendMessage({ body: cleanMessage, channelId: currentChannelId });
        resetForm();

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      } catch (err) {
        console.error('Ошибка при отправке сообщения:', err);
        toast.error(t('messages.sendError'));
      }
    },
  });

  return (
    <div className="mt-auto px-5 py-3">
      <Form onSubmit={formik.handleSubmit} noValidate className="py-1 border rounded-2">
        <Form.Group className="input-group has-validation">
          <Form.Control
            name="message"
            ref={inputRef}
            aria-label={t('messages.newMessageLabel')}
            placeholder={t('messages.newMessage')}
            className="border-1 p-0 ps-2 input-message-bg"
            value={formik.values.message}
            onChange={formik.handleChange}
            isInvalid={formik.touched.message && !!formik.errors.message}
            disabled={isLoading}
            autoFocus
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.message}
          </Form.Control.Feedback>
          <Button type="submit" className="btn-group-vertical" variant="light" disabled={isLoading || !formik.values.message.trim()}>
            <BsArrowRightSquare size={20} />
            <span className="visually-hidden">{t('messages.send')}</span>
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

export default MessageInput;
