import * as yup from 'yup';

/**
 * Схема валидации для страницы логина
 * @param {Function} t - Функция перевода
 * @returns {yup.ObjectSchema}
 */
export const loginValidationSchema = (t) => yup.object({
  username: yup.string().required(t('usernameRequired')),
  password: yup.string().required(t('passwordRequired')),
});

/**
 * Схема валидации для страницы регистрации
 * @param {Function} t - Функция перевода
 * @returns {yup.ObjectSchema}
 */
export const signUpValidationSchema = (t) => yup.object({
  username: yup.string()
    .min(3, t('usernameLengthRule'))
    .max(20, t('usernameLengthRule'))
    .required(t('usernameRequired')),
  password: yup.string()
    .min(6, t('errorPasswordShort'))
    .required(t('passwordRequired')),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], t('errorPasswordsMatch'))
    .required(t('confirmPasswordRequired')),
});

/**
 * Схема валидации для добавления канала
 * @param {Function} t - Функция перевода
 * @param {Array<string>} channelNames - Список существующих каналов
 * @returns {yup.ObjectSchema}
 */
export const addChannelValidationSchema = (t, channelNames) => yup.object({
  name: yup.string()
    .trim()
    .required(t('addChannel.validation.required'))
    .min(3, t('addChannel.validation.minMax'))
    .max(20, t('addChannel.validation.minMax'))
    .notOneOf(channelNames, t('addChannel.validation.unique')),
});

/**
 * Схема валидации для ввода сообщений в чат
 * @param {Function} t - Функция перевода
 * @returns {yup.ObjectSchema}
 */
export const messageValidationSchema = (t) => yup.object({
  message: yup.string().trim().required(t('messages.newMessage')),
});
