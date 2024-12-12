"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface CookieContextType {
  consent: boolean | null;
  setConsent: (consent: boolean | null) => void;
  giveConsent: () => void;
  isSubtitlesEnabled: boolean;
  setIsSubtitlesEnabled: (enabled: boolean) => void;
  audioLanguage: string;
  setAudioLanguage: (language: string) => void;
  subtitleLanguage: string;
  setSubtitleLanguage: (language: string) => void;
  profileImage: string;
  setProfileImage: (image: string) => void;
  handleAudioLanguageChange: (language: string) => void;
  handleSubtitlesToggle: (enabled: boolean) => void;
  savedSeries: string[];
  setSavedSeries: (series: string[]) => void;
  toggleSavedSeries: (seriesId: string) => void;
}

interface CookieProviderProps {
  children: ReactNode;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export function CookieProvider({ children }: CookieProviderProps) {
  const [consent, setConsent] = useState<boolean | null>(null); // Inizializza come null
  const [isSubtitlesEnabled, setIsSubtitlesEnabled] = useState(false);
  const [audioLanguage, setAudioLanguage] = useState("it"); // Cambiato da audioTrack a audioLanguage
  const [subtitleLanguage, setSubtitleLanguage] = useState("it"); // Stato separato per la lingua dei sottotitoli
  const [profileImage, setProfileImage] = useState("/img/profile/default.png"); // Assicurati che l'URL sia completo
  const [savedSeries, setSavedSeries] = useState<string[]>([]);

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

    const savedSeriesList = localStorage.getItem("savedSeries");
    if (savedSeriesList) {
      setSavedSeries(JSON.parse(savedSeriesList));
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

  // Funzione per gestire il cambio della lingua audio
  const handleAudioLanguageChange = (language: string) => {
    setAudioLanguage(language);
    localStorage.setItem("audioLanguage", language); // Salva la lingua audio nei cookie
  };

  // Funzione per gestire il cambio dello stato dei sottotitoli
  const handleSubtitlesToggle = (enabled: boolean) => {
    setIsSubtitlesEnabled(enabled);
    localStorage.setItem("subtitlesEnabled", JSON.stringify(enabled)); // Salva lo stato dei sottotitoli nei cookie
  };

  const toggleSavedSeries = (seriesId: string) => {
    setSavedSeries(prev => {
      const newSeries = prev.includes(seriesId) 
        ? prev.filter(id => id !== seriesId)
        : [...prev, seriesId];
      
      if (consent) {
        localStorage.setItem("savedSeries", JSON.stringify(newSeries));
      }
      return newSeries;
    });
  };

  return (
    <CookieContext.Provider value={{
      consent,
      setConsent,
      giveConsent,
      isSubtitlesEnabled,
      setIsSubtitlesEnabled,
      audioLanguage,
      setAudioLanguage,
      subtitleLanguage,
      setSubtitleLanguage,
      profileImage,
      setProfileImage,
      handleAudioLanguageChange,
      handleSubtitlesToggle,
      savedSeries,
      setSavedSeries,
      toggleSavedSeries,
    }}>
      {children}
    </CookieContext.Provider>
  );
}

export const useCookie = (): CookieContextType => {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error("useCookie must be used within a CookieProvider");
  }
  return context;
};
