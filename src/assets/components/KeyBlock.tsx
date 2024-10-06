"use client";

import { useEffect } from "react";

const KeyBlocker = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Blocca F12
      if (event.key === 'F12') {
        event.preventDefault();
      }
      // Blocca Ctrl+Shift+I
      if (event.ctrlKey && event.shiftKey && event.key === 'I') {
        event.preventDefault();
      }
      // Blocca Ctrl+Shift+J
      if (event.ctrlKey && event.shiftKey && event.key === 'J') {
        event.preventDefault();
      }
      // Blocca Ctrl+U
      if (event.ctrlKey && event.key === 'u') {
        event.preventDefault();
      }
      // Blocca Ctrl+Shift+J
      if (event.ctrlKey && event.shiftKey && event.key === 'J') {
        event.preventDefault();
      }
      // Blocca Ctrl+Shift+K
      if (event.ctrlKey && event.shiftKey && event.key === 'K') {
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
};

export default KeyBlocker;
