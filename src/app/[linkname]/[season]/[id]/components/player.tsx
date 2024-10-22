"use client";

import "../style.css";

import { useState, useEffect, useRef } from "react";

import { Tabs, Tab } from "@nextui-org/react";

// Icons
import { FaPlay, FaPause, FaArrowLeft } from "react-icons/fa6";
import {
  MdReplay10,
  MdForward10,
  MdFullscreen,
  MdVolumeUp,
  MdVolumeOff,
  MdSubtitles,
  MdSpeed,
  MdOutlineTextFields,
  MdHeadphones,
} from "react-icons/md";
import { PiGearFill } from "react-icons/pi";

export default function Player({
  videoSrc,
  typeVideo,
}: {
  videoSrc: string;
  typeVideo: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState([0, 0]);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [duration, setDuration] = useState([0, 0]);
  const [durationSec, setDurationSec] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [subtitlesActive, setSubtitlesActive] = useState(false);
  const [volume, setVolume] = useState(true);

  // Converte il tempo in minuti e secondi
  const sec2Min = (sec: number) => {
    const min = Math.floor(sec / 60);
    const secRemain = Math.floor(sec % 60);
    return {
      min: min,
      sec: secRemain,
    };
  };

  // Formatta il tempo in minuti e secondi
  const formatTime = (time: number) => {
    return time < 10 ? `0${time}` : time.toString();
  };

  // Imposta la durata e il tempo attuale del video
  useEffect(() => {
    if (videoRef.current) {
      const { min, sec } = sec2Min(videoRef.current.duration);
      setDurationSec(videoRef.current.duration);
      setDuration([min, sec]);

      const interval = setInterval(() => {
        if (videoRef.current) {
          const { min, sec } = sec2Min(videoRef.current.currentTime);
          setCurrentTimeSec(videoRef.current.currentTime);
          setCurrentTime([min, sec]);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  // Cambia il tempo del video
  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime =
        (event.target.valueAsNumber / 1000) * videoRef.current.duration; // Risoluzione aumentata
      videoRef.current.currentTime = newTime;
    }
  };

  // Aggiorna il progresso del video
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress =
        (videoRef.current.currentTime / videoRef.current.duration) * 1000; // Risoluzione aumentata
      setProgress(currentProgress);
      const { min, sec } = sec2Min(videoRef.current.currentTime);
      setCurrentTime([min, sec]); // Aggiorna il tempo attuale con valori numerici

      // Aggiorna lo stile del range input
      const rangeInput = document.querySelector(
        `.progress-bar input[type="range"]`
      );
      if (rangeInput) {
        const percentage = (currentProgress / 1000) * 100;
        (
          rangeInput as HTMLInputElement
        ).style.background = `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${percentage}%, var(--bg-track) ${percentage}%, var(--bg-track) 100%)`;
      }
    }
  };

  // Play/Pause video
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  // Fullscreen
  const handleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.parentElement?.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  // Aiuta su WebKit a vedere il colore dell'input range
  useEffect(() => {
    const volumeInput = document.querySelector(
      ".volume-bar"
    ) as HTMLInputElement;
    if (volumeInput) {
      volumeInput.value = "99";
      volumeInput.style.background = `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) 99%, var(--bg-track) 99%, var(--bg-track) 100%)`;

      setTimeout(() => {
        volumeInput.value = "100";
        volumeInput.style.background = `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) 100%, var(--bg-track) 100%, var(--bg-track) 100%)`;
      }, 100); // Attendi un breve momento prima di impostare a 100
    }
  }, []);

  // Funzione per alternare la visibilità della scheda
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  // Funzione per gestire il click sul bottone dei sottotitoli
  const handleSubtitlesToggle = () => {
    setSubtitlesActive(!subtitlesActive);
  };

  // Funzione per spostare il video indietro di 10 secondi
  const handleRewind = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        videoRef.current.currentTime - 10
      );
    }
  };

  // Funzione per spostare il video avanti di 10 secondi
  const handleForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.duration,
        videoRef.current.currentTime + 10
      );
    }
  };

  // Funzione per cambiare il volume
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const volume = event.target.valueAsNumber;
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }

    // Aggiorna lo stile del range input del volume
    const volumeInput = event.target;
    const percentage = volume;
    volumeInput.style.background = `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${percentage}%, var(--bg-track) ${percentage}%, var(--bg-track) 100%)`;
  };

  // Funzione per azzerare il volume o impostarlo al 20% quando si clicca il bottone
  const handleMuteToggle = () => {
    if (videoRef.current) {
      // Controlla se il volume è già a zero
      if (videoRef.current.volume === 0) {
        videoRef.current.volume = 0.2; // Imposta il volume al 20%
      } else {
        videoRef.current.volume = 0; // Altrimenti, azzera il volume
      }
      setVolume(!volume);
    }
    if (videoRef.current) {
      // Aggiorna lo stile del range input del volume
      const volumeInput = document.querySelector(
        ".volume-bar"
      ) as HTMLInputElement;
      volumeInput.value = String(videoRef.current.volume * 100);
      const percentage = videoRef.current.volume * 100;
      volumeInput.style.background = `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${percentage}%, var(--bg-track) ${percentage}%, var(--bg-track) 100%)`;
    }
  };

  // Aggiungi le funzioni per spostarsi di un frame
  const handleRewindFrame = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        videoRef.current.currentTime - 1 / 30
      ); // Assumendo 30 FPS
    }
  };

  const handleForwardFrame = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.duration,
        videoRef.current.currentTime + 1 / 30
      ); // Assumendo 30 FPS
    }
  };

  // Aggiungi la funzione changeVolume per modificare il volume
  const changeVolume = (change: number) => {
    if (videoRef.current) {
      const newVolume =
        Math.min(100, Math.max(0, videoRef.current.volume * 100 + change)) /
        100;
      videoRef.current.volume = newVolume;
      setVolume(newVolume > 0);

      // Aggiorna lo stile del range input del volume
      const volumeInput = document.querySelector(
        ".volume-bar"
      ) as HTMLInputElement;
      if (volumeInput) {
        volumeInput.value = String(newVolume * 100);
        const percentage = newVolume * 100;
        volumeInput.style.background = `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${percentage}%, var(--bg-track) ${percentage}%, var(--bg-track) 100%)`;
      }
    }
  };

  // Aggiungi un useEffect per gestire gli eventi da tastiera
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case " ":
          handlePlayPause();
          break;
        case "m":
          handleMuteToggle();
          break;
        case "f":
          handleFullscreen();
          break;
        case ",":
          handleRewindFrame();
          break;
        case ".":
          handleForwardFrame();
          break;
        case "c":
          handleSubtitlesToggle();
          break;
        case "ArrowUp":
          changeVolume(10); // Aumenta il volume del 10%
          break;
        case "ArrowDown":
          changeVolume(-10); // Diminuisce il volume del 10%
          break;
        case "ArrowLeft":
          handleRewind(); // Sposta indietro di 10 secondi
          break;
        case "ArrowRight":
          handleForward(); // Sposta avanti di 10 secondi
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    handlePlayPause,
    handleMuteToggle,
    handleFullscreen,
    handleRewindFrame,
    handleForwardFrame,
    handleSubtitlesToggle,
    handleRewind,
    handleForward,
    changeVolume,
  ]);

  return (
    <div className="video-container">
      <div className="menu-top">
        <a href="/" className="back-button" title="Torna alla Home">
          <FaArrowLeft />
        </a>
      </div>

      <div className="controls-container">
        {/* Tempo */}
        <div className="minutes-container">
          <span>
            {formatTime(currentTime[0])}:{formatTime(currentTime[1])}
          </span>
          <span>
            {formatTime(duration[0])}:{formatTime(duration[1])}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <input
            type="range"
            min="0"
            max="1000"
            id="progress-bar"
            value={progress}
            onChange={handleProgressChange}
          />
        </div>

        {/* Controlli */}
        <div className="flex items-center justify-between pl-1 my-2">
          {/* Bottoni a sinistra */}
          <div className="flex items-center justify-start gap-4">
            {/* Pausa / Play */}
            <button type="button" onClick={handlePlayPause}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>

            {/* Indietro di 10s */}
            <button
              type="button"
              id="replay10"
              onClick={(e) => {
                handleRewind();
                e.currentTarget.blur();
              }}
            >
              <MdReplay10 />
            </button>

            {/* Avanti di 10s */}
            <button
              type="button"
              id="forward10"
              onClick={(e) => {
                handleForward();
                e.currentTarget.blur();
              }}
            >
              <MdForward10 />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-4">
              <button type="button" id="volume" onClick={handleMuteToggle}>
                {!volume ? <MdVolumeOff /> : <MdVolumeUp />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                onChange={handleVolumeChange}
                className="volume-bar"
              />
            </div>
          </div>

          {/* Bottoni a destra */}
          <div className="flex flex-row-reverse items-center justify-end gap-4">
            <button type="button" onClick={handleFullscreen} id="fullscreen">
              <MdFullscreen className="icon-fullscreen" />
            </button>

            <button
              type="button"
              id="settings"
              onClick={toggleSidebar}
              className={`transition-all duration-300 ease-in-out ${
                isSidebarVisible ? "rotate-45" : ""
              }`}
            >
              <PiGearFill />
            </button>

            <button
              type="button"
              id="subtitles"
              onClick={handleSubtitlesToggle}
            >
              <MdSubtitles />
              <div
                className={`underline-subtitles ${
                  subtitlesActive ? "active" : ""
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`
          subtitles-text
          ${subtitlesActive ? "" : " hidden"}
        `}
      >
        <p>Sottotitoli</p>
      </div>

      {/* Video */}
      <video
        className="video-player"
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
      >
        <source src={videoSrc} type={typeVideo} />
      </video>

      {/* Sidebar subtitles */}
      <div className={`sidebar ${isSidebarVisible ? "visible" : ""}`}>
        <Tabs aria-label="Options" isVertical>
          <Tab
            key="velocita"
            title={
              <div className="flex flex-col items-center justify-center">
                <MdSpeed />
                <span>Velocità</span>
              </div>
            }
            className="!text-base w-full h-full"
          >
            <div className="flex flex-col gap-2">
              <p>Velocità</p>
              <button type="button" className="velocita-button">
                0.5x
              </button>
              <button type="button" className="velocita-button active">
                1x
              </button>
              <button type="button" className="velocita-button">
                1.25x
              </button>
              <button type="button" className="velocita-button">
                1.50x
              </button>
              <button type="button" className="velocita-button">
                2x
              </button>
            </div>
          </Tab>
          <Tab
            key="subtitles"
            title={
              <div className="flex flex-col items-center justify-center">
                <MdOutlineTextFields />
                <span>Sottotitoli</span>
              </div>
            }
            className="!text-base w-full h-full"
          >
            <div className="flex flex-col gap-2">
              <p>Sottotitoli</p>
              <button type="button" className="subtitles-button active">
                Italiano
              </button>
              <button type="button" className="subtitles-button">
                Inglese
              </button>
            </div>
          </Tab>
          <Tab
            key="audio"
            title={
              <div className="flex flex-col items-center justify-center">
                <MdHeadphones />
                <span>Audio</span>
              </div>
            }
            className="!text-base w-full h-full"
          >
            <div className="flex flex-col gap-2">
              <p>Audio</p>
              <button type="button" className="audio-button active">
                Italiano
              </button>
              <button type="button" className="audio-button">
                Inglese
              </button>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
