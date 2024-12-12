"use client";

import PlayerComponent from "./components/player";
import { useCookie } from "@/assets/components/Cookies/CookieProvider";
import { useParams } from "next/navigation";
import seriesDatabase from "@/assets/database/series-database";

export default function Player() {
  const { subtitleLanguage, audioLanguage } = useCookie();
  const params = useParams();

  if (!params) {
    return <div>Parametri non trovati</div>;
  }

  // Estrai i parametri dall'URL
  const linkname = params.linkname as string;
  const season = params.season as string;
  const episodeId = params.id as string;

  // Trova la serie corretta nel database
  const series = seriesDatabase.find((s) => s.linkName === linkname);

  // Se la serie esiste, trova l'episodio corretto
  const episode = series?.episodes
    .find((s) => s.season === parseInt(season))
    ?.episodes.find((e) => e.id === episodeId);

  // Controlla se la serie o l'episodio non esiste
  if (!series || !episode) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
        <div className="text-white text-center p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">
            Questo episodio non esiste
          </h2>
          <p>
            Controlla di aver inserito l'episodio correttamente o torna alla
            pagina principale.
          </p>
        </div>
        <a
          href="/"
          className="text-white bg-[var(--unknown-primary)] px-4 py-2 rounded-lg hover:bg-[var(--unknown-primary-hover)] hover:shadow-lg transition-all duration-300"
        >
          Torna alla Home
        </a>
      </div>
    );
  }

  // Controlla se l'episodio è offline
  if (episode.status === "offline") {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
        <div className="text-white text-center p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Episodio non disponibile</h2>
          <p>Questo episodio non è ancora disponibile per la visione.</p>
        </div>
        <a
          href="/"
          className="text-white bg-[var(--unknown-primary)] px-4 py-2 rounded-lg hover:bg-[var(--unknown-primary-hover)] hover:shadow-lg transition-all duration-300"
        >
          Torna alla Home
        </a>
      </div>
    );
  }

  // Costruisci i percorsi delle risorse
  const videoSrc = `/m3u8/the_amazing_digital_circus/1/tadc_s1e1/tadc.m3u8`;
  const subtitleSrcEn = `/m3u8/the_amazing_digital_circus/1/tadc_s1e1/tadc_en_subtitle.vtt`;
  const subtitleSrcIt = `/m3u8/the_amazing_digital_circus/1/tadc_s1e1/tadc_it_subtitle.vtt`;

  return (
    <PlayerComponent
      videoSrc={videoSrc}
      typeVideo="application/x-mpegURL"
      subtitleSrcEn={subtitleSrcEn}
      subtitleSrcIt={subtitleSrcIt}
      currentLanguage={subtitleLanguage}
      availableAudio={series.audio}
      currentAudio={audioLanguage}
      episodeTitle={episode.title}
      episodeNumber={episode.nEp}
      seriesTitle={series.Name}
      episodeSeason={parseInt(season)}
    />
  );
}
