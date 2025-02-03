import Rollbar from 'rollbar';

console.log('Rollbar Token:', import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN);

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN, // Используем VITE_ вместо process.env
  environment: import.meta.env.MODE || 'development', // Используем import.meta.env.MODE
  captureUncaught: true,
  captureUnhandledRejections: true
};

// Создаём и экспортируем корректный экземпляр Rollbar
const rollbarInstance = new Rollbar(rollbarConfig);

export default rollbarInstance;
