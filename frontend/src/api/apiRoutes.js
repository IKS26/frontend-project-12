const apiPath = '/api/v1';

const apiRoutes = {
  base: apiPath,
  login: `${apiPath}/login`,
  signUp: `${apiPath}/signup`,
  channels: 'channels',
  channel: (id) => `channels/${id}`,
  messages: 'messages',
  messagesByChannel: (channelId) => `messages?channelId=${channelId}`,
};

export default apiRoutes;
