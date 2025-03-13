import React, { useEffect, useState } from 'react';
import anime from 'animejs';

const GlobalSpinner = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    anime
      .timeline({ loop: false })
      .add({
        targets: '.ml15 .big-letter',
        scale: [12, 1],
        opacity: [0, 1],
        easing: 'easeOutCirc',
        duration: 800,
      })
      .add({
        targets: '.ml15 .word.chat',
        opacity: [0, 1],
        translateY: [-30, 0],
        easing: 'easeOutCirc',
        duration: 800,
        offset: '-=600',
      })
      .add({
        targets: '.ml15',
        opacity: 0,
        duration: 1000,
        easing: 'easeOutExpo',
        delay: 1000,
        complete: () => setIsVisible(false),
      });
  }, []);

  if (!isVisible) return null;

  return (
    <div className="global-spinner-container">
      <h1 className="ml15">
        <span className="word big-letter">X</span>
        <br />
        <span className="word chat">Chat</span>
      </h1>
    </div>
  );
};

export default GlobalSpinner;
