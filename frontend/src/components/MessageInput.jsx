import React from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import leoProfanity from 'leo-profanity';
import { useTranslation } from 'react-i18next';
import { BsArrowRightSquare } from 'react-icons/bs';
import { useSendMessageMutation } from '../services/dataApi';

const MessageInput = ({ currentChannelId }) => {
  const { t } = useTranslation('chat');
  const [sendMessage, { isLoading }] = useSendMessageMutation();

  const formik = useFormik({
    initialValues: { message: '' },
    validationSchema: Yup.object({
      message: Yup.string().trim().required(t('messages.newMessage')),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (leoProfanity.check(values.message)) {
        toast.error(t('messages.errorProfanityDetected'));  
      }

      try {
        const cleanMessage = leoProfanity.clean(values.message);
        await sendMessage({ body: cleanMessage, channelId: currentChannelId });
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
            aria-label={t('messages.newMessageLabel')}
            placeholder={t('messages.newMessage')}
            {...formik.getFieldProps('message')}
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
            <span className="visually-hidden">{t('messages.send')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
