"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CookieContext = createContext();

export function CookieProvider({ children }) {
  const [consent, setConsent] = useState(null); // Inizializza come null
  const [isSubtitlesEnabled, setIsSubtitlesEnabled] = useState(false);
  const [audioLanguage, setAudioLanguage] = useState("it"); // Cambiato da audioTrack a audioLanguage
  const [subtitleLanguage, setSubtitleLanguage] = useState("it"); // Stato separato per la lingua dei sottotitoli
  const [profileImage, setProfileImage] = useState("/img/profile/default.png"); // Assicurati che l'URL sia completo

  useEffect(() => {
    const savedConsent = localStorage.getItem("cookieConsent");
    if (savedConsent !== null) {
      setConsent(JSON.parse(savedConsent));
    } else {
      setConsent(false); // Imposta false se non c'è consenso salvato
    }

    const savedSubtitlesEnabled = localStorage.getItem("subtitlesEnabled");
    if (savedSubtitlesEnabled !== null) {
      setIsSubtitlesEnabled(JSON.parse(savedSubtitlesEnabled));
    }

    const savedAudioLanguage = localStorage.getItem("audioLanguage"); // Cambiato da audioTrack a audioLanguage
    if (savedAudioLanguage !== null) {
      setAudioLanguage(savedAudioLanguage);
    }

    const savedSubtitleLanguage = localStorage.getItem("subtitleLanguage");
    if (savedSubtitleLanguage !== null) {
      setSubtitleLanguage(savedSubtitleLanguage);
    }

    const savedProfileImage = localStorage.getItem("profileImage");
    if (savedProfileImage !== null) {
      setProfileImage(savedProfileImage);
    } else {
      setProfileImage("/img/profile/default.png"); // Imposta l'immagine di default se non esiste
    }
  }, []);

  const giveConsent = () => {
    setConsent(true);
    localStorage.setItem("cookieConsent", JSON.stringify(true));
    localStorage.setItem("subtitlesEnabled", JSON.stringify(isSubtitlesEnabled));
    localStorage.setItem("audioLanguage", audioLanguage); // Cambiato da audioTrack a audioLanguage
    localStorage.setItem("subtitleLanguage", subtitleLanguage);
    localStorage.setItem("profileImage", profileImage); // Salva l'immagine del profilo
  };

  return (
    <CookieContext.Provider value={{ consent, setConsent, giveConsent, isSubtitlesEnabled, setIsSubtitlesEnabled, audioLanguage, setAudioLanguage, subtitleLanguage, setSubtitleLanguage, profileImage, setProfileImage }}>
      {children}
    </CookieContext.Provider>
  );
}

export const useCookie = () => useContext(CookieContext);
