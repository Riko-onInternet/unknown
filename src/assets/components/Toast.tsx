import React, { useEffect, useState } from "react";

export default function Toast({ message, onClose }: { message: string, onClose: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const fadeOutTimeout = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onClose();
      }, 200); // Tempo per la transizione di fade-out
    }, 5000); // Tempo di visualizzazione del toast

    return () => clearTimeout(fadeOutTimeout);
  }, [onClose]);

  return (
    <div className={`toast ${visible ? 'fade-in-toast' : 'fade-out-toast'}`} id="toast">
      <p>{message}</p>
    </div>
  );
}
