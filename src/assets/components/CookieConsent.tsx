"use client"; // Aggiungi questa linea

import { useState, useEffect } from "react";
import { useCookie } from "@/assets/components/CookieProvider";
import Logo from "./Logo";

export default function CookieConsent() {
  const {
    consent,
    giveConsent,
    isSubtitlesEnabled,
    setIsSubtitlesEnabled,
    audioLanguage,
    setAudioLanguage,
  } = useCookie(); // Cambiato da audioTrack a audioLanguage
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (consent !== null) {
      setIsVisible(!consent);
    }
  }, [consent]);

  const handleAccept = () => {
    giveConsent();
    setIsVisible(false);
  };

  const handleDecline = () => {
    setIsVisible(false); // Nasconde la scheda
    // Logica per rifare i cookie
  };

  if (consent === null) return null;

  return (
    <div
      className={`cookie-modal ${isVisible ? "fade-in" : "fade-out"}`}
      id="cookie-modal"
    >
      <div className="container-cookie-icon w-full flex justify-center">
        <img src="/logo/full.png" alt="Logo" className="w-full px-4" />
      </div>

      {/* Testo */}
      <p>
        Questo sito utilizza i cookie solo per migliorare l'esperienza di
        navigazione. I dati raccolti rimarranno sempre memorizzati localmente
        nel dispositivo e non saranno mai condivisi con terze parti.
      </p>
      <p>
        Le preferenze selezionate dell'utente saranno salvate esclusivamente sul
        dispositivo che stai utilizzando in questo momento.
      </p>
      <p>
        Per maggiori informazioni sui cookie, consulta la nostra{" "}
        <a href="/privacy-policy" target="_blank">
          politica sulla privacy
        </a>
        .
      </p>

      {/* Bottoni */}
      <div className="w-full flex justify-between gap-4 container-buttons-cookie">
        <button onClick={handleDecline} aria-label="Declina">
          Declina
        </button>
        <button onClick={handleAccept} aria-label="Accetta">
          Accetta
        </button>
      </div>
    </div>
  );
}
