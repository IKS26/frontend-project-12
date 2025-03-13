import React from 'react';
import { Comment } from 'react-loader-spinner';

const ChatSpinner = () => (
  <div className="spinner-container">
    <Comment
      visible
      height="160"
      width="160"
      ariaLabel="comment-loading"
      color="#2C2C2C"
      backgroundColor="#ffc107"
    />
  </div>
);

export default ChatSpinner;
