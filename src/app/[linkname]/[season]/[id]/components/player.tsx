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
  MdSkipNext,
} from "react-icons/md";
import { PiGearFill } from "react-icons/pi";
import Hls from "hls.js";

// Importa il hook per utilizzare il contesto
import { useCookie } from "@/assets/components/CookieProvider"; // Assicurati che il percorso sia corretto

export default function Player({
  videoSrc,
  typeVideo,
  subtitleSrcEn,
  subtitleSrcIt,
  currentLanguage,
  availableAudio,
  currentAudio,
}: {
  videoSrc: string;
  typeVideo: string;
  subtitleSrcEn: string;
  subtitleSrcIt: string;
  currentLanguage: string;
  availableAudio: { name: string; id: string }[];
  currentAudio: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hls = useRef<Hls>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState([0, 0]);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [duration, setDuration] = useState([0, 0]);
  const [durationSec, setDurationSec] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [subtitlesActive, setSubtitlesActive] = useState(false);
  const [volume, setVolume] = useState(true);
  const [subtitleTextEn, setSubtitleTextEn] = useState("");
  const [subtitleTextIt, setSubtitleTextIt] = useState("");
  const [subtitlesHidden, setSubtitlesHidden] = useState(false);
  const {
    subtitleLanguage,
    setSubtitleLanguage,
    isSubtitlesEnabled,
    setIsSubtitlesEnabled,
    setAudioLanguage,
    audioLanguage,
  } = useCookie();
  const [selectedAudio, setSelectedAudio] = useState(audioLanguage);
  const [buffered, setBuffered] = useState(0);

  // Aggiorna l'interfaccia del componente per includere il riferimento al progress bar
  const progressBarRef = useRef<HTMLDivElement>(null);

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

  // Aggiungi questi stati
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);

  // Modifica la funzione handleProgressChange
  const handleProgressChange = (event: React.MouseEvent<HTMLDivElement>) => {
    updateVideoProgress(event.clientX);
  };

  // Aggiungi queste nuove funzioni per il trascinamento della progress bar
  const handleProgressMouseDown = () => {
    setIsDraggingProgress(true);
  };

  const handleProgressMouseUp = () => {
    setIsDraggingProgress(false);
  };

  const handleProgressMouseMove = (event: MouseEvent) => {
    if (isDraggingProgress) {
      updateVideoProgress(event.clientX);
    }
  };

  const updateVideoProgress = (clientX: number) => {
    if (videoRef.current && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const newTime = percentage * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
    }
  };

  // Simili funzioni per il volume
  const handleVolumeMouseDown = () => {
    setIsDraggingVolume(true);
  };

  const handleVolumeMouseUp = () => {
    setIsDraggingVolume(false);
  };

  const handleVolumeMouseMove = (event: MouseEvent) => {
    if (isDraggingVolume) {
      updateVolume(event.clientX);
    }
  };

  const updateVolume = (clientX: number) => {
    if (videoRef.current && volumeBarRef.current) {
      const rect = volumeBarRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      videoRef.current.volume = percentage;
      setVolume(percentage > 0);
    }
  };

  // Aggiungi un useEffect per gestire gli eventi del mouse
  useEffect(() => {
    const handleMouseUp = () => {
      setIsDraggingProgress(false);
      setIsDraggingVolume(false);
    };

    const handleMouseMove = (event: MouseEvent) => {
      handleProgressMouseMove(event);
      handleVolumeMouseMove(event);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingProgress, isDraggingVolume]);

  // Modifica la funzione handleTimeUpdate
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
      const { min, sec } = sec2Min(videoRef.current.currentTime);
      setCurrentTime([min, sec]);

      // Aggiorna lo stile della progress bar
      if (progressBarRef.current) {
        const progressFill = progressBarRef.current.querySelector(
          ".progress-fill"
        ) as HTMLElement;
        if (progressFill) {
          progressFill.style.width = `${currentProgress}%`;
        }
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
  /* useEffect(() => {
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
  }, []); */

  // Funzione per alternare la visibilità della scheda
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  // Funzione per gestire il click sul bottone dei sottotitoli
  const handleSubtitlesToggle = () => {
    const newValue = !subtitlesActive;
    setSubtitlesActive(newValue);
    setIsSubtitlesEnabled(newValue);
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

  useEffect(() => {
    if (Hls.isSupported() && videoRef.current) {
      const hlsInstance = new Hls();
      hlsInstance.loadSource(videoSrc);
      hlsInstance.attachMedia(videoRef.current);
      (hls as any).current = hlsInstance;
    } else if (videoRef.current && videoRef.current.canPlayType(typeVideo)) {
      videoRef.current.src = videoSrc;
    }

    return () => {
      if (hls.current) {
        hls.current.destroy();
      }
    };
  }, [videoSrc, typeVideo]);

  // Modifica l'useEffect per gestire entrambe le tracce di sottotitoli
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const trackEn = videoElement.textTracks[0];
      const trackIt = videoElement.textTracks[1];

      // Imposta entrambe le tracce come "showing" per ricevere gli eventi
      trackEn.mode = "showing";
      trackIt.mode = "showing";

      trackEn.oncuechange = function () {
        const activeCue = trackEn.activeCues?.[0];
        if (activeCue && "text" in activeCue) {
          setSubtitleTextEn((activeCue.text as string) ?? "");
        } else {
          setSubtitleTextEn("");
        }
      };

      trackIt.oncuechange = function () {
        const activeCue = trackIt.activeCues?.[0];
        if (activeCue && "text" in activeCue) {
          setSubtitleTextIt((activeCue.text as string) ?? "");
        } else {
          setSubtitleTextIt("");
        }
      };
    }
  }, []);

  // Effetto per gestire la sidebar
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;
    const body = document.body;

    const handleMouseMove = () => {
      console.log("🖱️ Mouse moved");
      const controlsContainer = document.querySelector(".controls-container");
      const subtitlesText = document.querySelector(".subtitles-container");
      const menuTop = document.querySelector(".menu-top");

      if (controlsContainer && subtitlesText && menuTop) {
        controlsContainer.classList.remove("hide-controls");
        subtitlesText.classList.remove("hide-controls");
        menuTop.classList.remove("hide-controls");
        body.classList.remove("hide-cursor");
      }

      clearTimeout(timeoutId);

      if (isPlaying) {
        timeoutId = setTimeout(() => {
          const controlsContainer = document.querySelector(
            ".controls-container"
          );
          const subtitlesText = document.querySelector(".subtitles-container");
          const menuTop = document.querySelector(".menu-top");

          if (controlsContainer && subtitlesText && menuTop) {
            controlsContainer.classList.add("hide-controls");
            subtitlesText.classList.add("hide-controls");
            menuTop.classList.add("hide-controls");
            body.classList.add("hide-cursor");
          }
        }, 2000);
      }
    };

    const handlePlayStateChange = (event: Event) => {
      if (event.type === "play") {
        timeoutId = setTimeout(() => {
          const controlsContainer = document.querySelector(
            ".controls-container"
          );
          const subtitlesText = document.querySelector(".subtitles-container");
          const menuTop = document.querySelector(".menu-top");

          if (controlsContainer && subtitlesText && menuTop) {
            controlsContainer.classList.add("hide-controls");
            subtitlesText.classList.add("hide-controls");
            menuTop.classList.add("hide-controls");
            body.classList.add("hide-cursor");
          }
        }, 2000);
      } else if (event.type === "pause") {
        const controlsContainer = document.querySelector(".controls-container");
        const subtitlesText = document.querySelector(".subtitles-container");
        const menuTop = document.querySelector(".menu-top");

        if (controlsContainer && subtitlesText && menuTop) {
          controlsContainer.classList.remove("hide-controls");
          subtitlesText.classList.remove("hide-controls");
          menuTop.classList.remove("hide-controls");
          body.classList.remove("hide-cursor");
        }
        clearTimeout(timeoutId);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    videoRef.current?.addEventListener("play", handlePlayStateChange);
    videoRef.current?.addEventListener("pause", handlePlayStateChange);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      videoRef.current?.removeEventListener("play", handlePlayStateChange);
      videoRef.current?.removeEventListener("pause", handlePlayStateChange);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isPlaying]);

  // Funzione per cambiare la lingua dei sottotitoli e aggiornare il cookie
  const changeSubtitleLanguage = (language: string) => {
    setSubtitleLanguage(language); // Aggiorna il contesto e il cookie
    // Qui potresti anche aggiornare il percorso dei sottotitoli se necessario
  };

  // Sincronizza lo stato locale con quello del contesto
  useEffect(() => {
    setSubtitlesActive(isSubtitlesEnabled);
  }, [isSubtitlesEnabled]);

  // Aggiungi questa funzione per gestire il click sul video
  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Sincronizza lo stato locale con quello dei cookie
  useEffect(() => {
    setSelectedAudio(audioLanguage);
  }, [audioLanguage]);

  // Funzione per gestire il cambio dell'audio
  const handleAudioChange = (audioId: string) => {
    setAudioLanguage(audioId);
    setSelectedAudio(audioId);
  };

  // Aggiungi questa funzione per gestire il buffering
  const handleProgress = () => {
    if (videoRef.current && videoRef.current.buffered.length > 0) {
      const bufferedEnd = videoRef.current.buffered.end(
        videoRef.current.buffered.length - 1
      );
      const duration = videoRef.current.duration;
      const bufferedPercentage = (bufferedEnd / duration) * 100;

      const progressBar = document.querySelector(
        'input[type="range"]'
      ) as HTMLInputElement;
      if (progressBar) {
        progressBar.style.setProperty(
          "--buffered-percentage",
          `${bufferedPercentage}%`
        );
      }
      setBuffered(bufferedPercentage);
    }
  };

  // Aggiungi l'evento progress al video
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener("progress", handleProgress);

      return () => {
        video.removeEventListener("progress", handleProgress);
      };
    }
  }, []);

  // Aggiungi questa nuova funzione per gestire il click sulla barra del volume
  const handleVolumeClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && volumeBarRef.current) {
      const rect = volumeBarRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const percentage = x / rect.width;
      const newVolume = Math.max(0, Math.min(1, percentage));
      videoRef.current.volume = newVolume;
      setVolume(newVolume > 0);
    }
  };

  // Aggiungi questo ref
  const volumeBarRef = useRef<HTMLDivElement>(null);

  return (
    <div className="video-container overflow-hidden">
      {/* ----- Menu top ----- */}
      <div className="menu-top">
        <a href="/" className="back-button" title="Torna alla Home">
          <FaArrowLeft />
        </a>
        <a href="/" className="back-button" title="Torna alla Home">
          <MdSkipNext />
        </a>
      </div>

      {/* <p className="w-full h-full flex items-center justify-center text-center text-base">
        Se stai vedendo questo messaggio, significa che: o qualcosa è andato storto, o che non è possibile caricare l'episodio selezionato.
      </p> */}

      {/* ----- Controlli ----- */}
      <div className="controls-container">
        {/* Tempo */}
        <div className="minutes">
          <span>
            {isNaN(currentTime[0]) || isNaN(currentTime[1])
              ? "00:00"
              : `${formatTime(currentTime[0])}:${formatTime(currentTime[1])}`}
          </span>
          <span>
            {isNaN(duration[0]) || isNaN(duration[1])
              ? "00:00"
              : `${formatTime(duration[0])}:${formatTime(duration[1])}`}
          </span>
        </div>

        {/* Progress Bar */}
        <div
          className="progress-bar"
          ref={progressBarRef}
          onClick={handleProgressChange}
          onMouseDown={handleProgressMouseDown}
        >
          <div className="progress-buffer" style={{ width: `${buffered}%` }} />
          <div className="progress-fill" style={{ width: `${progress}%` }}>
            <div className="progress-thumb" />
          </div>
        </div>

        {/* Controlli */}
        <div className="controls">
          {/* Bottoni a sinistra */}
          <div className="left">
            {/* Pausa / Play */}
            <button
              type="button"
              onClick={(e) => {
                handlePlayPause();
                e.currentTarget.blur();
              }}
              id="play_pause"
            >
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
              <button
                type="button"
                id="volume"
                onClick={(e) => {
                  handleMuteToggle();
                  e.currentTarget.blur();
                }}
              >
                {!volume ? <MdVolumeOff /> : <MdVolumeUp />}
              </button>
              <div
                className="volume-bar"
                ref={volumeBarRef}
                onClick={handleVolumeClick}
                onMouseDown={handleVolumeMouseDown}
              >
                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      videoRef.current?.volume
                        ? videoRef.current.volume * 100
                        : 100
                    }%`,
                  }}
                >
                  <div className="progress-thumb"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottoni a destra */}
          <div className="right">
            <button
              type="button"
              onClick={(e) => {
                handleFullscreen();
                e.currentTarget.blur();
              }}
              id="fullscreen"
            >
              <MdFullscreen className="icon-fullscreen" />
            </button>

            <button
              type="button"
              id="settings"
              onClick={(e) => {
                toggleSidebar();
                e.currentTarget.blur();
              }}
              className={`transition-all duration-300 ease-in-out ${
                isSidebarVisible ? "rotate-45" : ""
              }`}
            >
              <PiGearFill />
            </button>

            <button
              type="button"
              id="subtitles"
              onClick={(e) => {
                handleSubtitlesToggle();
                e.currentTarget.blur();
              }}
              className={`transition-all duration-200 ease-in-out ${
                subtitlesActive ? "text-[var(--color-primary)]" : ""
              }`}
            >
              <MdSubtitles />
            </button>
          </div>
        </div>
      </div>

      {/* ----- Video ----- */}
      <video
        className="video-player"
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        onProgress={handleProgress}
        onClick={handleVideoClick}
        src={videoSrc}
      >
        <track
          src={subtitleSrcEn}
          kind="subtitles"
          srcLang="en"
          label="English"
        />
        <track
          src={subtitleSrcIt}
          kind="subtitles"
          srcLang="it"
          label="Italiano"
        />
      </video>

      {/* ----- Sottotitoli ----- */}
      <div
        className={`subtitles-container${subtitlesActive ? " active" : ""}${
          subtitlesHidden ? " hide-controls" : ""
        }`}
      >
        <div
          className={`subtitles-text ${
            currentLanguage === "en" ? " visible" : ""
          }`}
        >
          <p>
            <span dangerouslySetInnerHTML={{ __html: subtitleTextEn }} />
          </p>
        </div>
        <div
          className={`subtitles-text ${
            currentLanguage === "it" ? " visible" : ""
          }`}
        >
          <p>
            <span dangerouslySetInnerHTML={{ __html: subtitleTextIt }} />
          </p>
        </div>
      </div>

      {/* ----- Sidebar ----- */}
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
              <button
                type="button"
                className={`subtitles-button ${
                  subtitleLanguage === "it" ? "active" : ""
                }`}
                onClick={() => changeSubtitleLanguage("it")}
              >
                Italiano
              </button>
              <button
                type="button"
                className={`subtitles-button ${
                  subtitleLanguage === "en" ? "active" : ""
                }`}
                onClick={() => changeSubtitleLanguage("en")}
              >
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
              {availableAudio.map((audio) => (
                <button
                  key={audio.id}
                  type="button"
                  className={`audio-button ${
                    selectedAudio === audio.id ? "active" : ""
                  }`}
                  onClick={() => handleAudioChange(audio.id)}
                >
                  {audio.name}
                </button>
              ))}
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
