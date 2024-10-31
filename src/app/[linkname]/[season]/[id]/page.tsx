"use client";

import PlayerComponent from "./components/player";
import { useCookie } from "@/assets/components/CookieProvider";
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
  const series = seriesDatabase.find(s => s.linkName === linkname);
  
  // Se la serie esiste, trova l'episodio corretto
  const episode = series?.episodes
    .find(s => s.season === parseInt(season))
    ?.episodes
    .find(e => e.id === episodeId);

  if (!series || !episode) {
    return <div>Episodio non trovato</div>;
  }

  // Costruisci i percorsi delle risorse
  const videoSrc = `/m3u8/${series.linkName}/${season}/${episode.id}/${series.m3u8}`;
  const subtitleSrcEn = `/m3u8/${series.linkName}/${season}/${episode.id}/${series.id}_en_subtitle.vtt`;
  const subtitleSrcIt = `/m3u8/${series.linkName}/${season}/${episode.id}/${series.id}_it_subtitle.vtt`;
  
  return (
    <PlayerComponent
      videoSrc={videoSrc}
      typeVideo="application/x-mpegURL"
      subtitleSrcEn={subtitleSrcEn}
      subtitleSrcIt={subtitleSrcIt}
      currentLanguage={subtitleLanguage}
      availableAudio={series.audio}
      currentAudio={audioLanguage}
    />
  );
}
