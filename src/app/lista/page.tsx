"use client";

import { useState } from "react";
import Header from "@/assets/components/Header";
import { useCookie } from "@/assets/components/CookieProvider";
import seriesDatabase from "@/assets/database/series-database";
import SeriesModal from "@/assets/components/SeriesModal";
import "./style.css";
export default function Lista() {
  const { savedSeries } = useCookie();
  const [openModalId, setOpenModalId] = useState<string | null>(null);

  const savedSeriesData = seriesDatabase.filter(serie => 
    savedSeries.includes(serie.id)
  );

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">La mia lista</h1>
        
        {savedSeriesData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">
              Non hai ancora aggiunto nessuna serie alla tua lista.
            </p>
            <p className="text-gray-400 mt-2">
              Aggiungi le tue serie preferite cliccando sull'icona del segnalibro.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {savedSeriesData.map(serie => (
              <div 
                key={serie.id}
                className="cursor-pointer list-card"
                onClick={() => setOpenModalId(serie.id)}
              >
                <img 
                  src={`/img/carousel/mobile/${serie.id}_slider_mobile.avif`} 
                  alt={serie.Name}
                  className="w-full rounded-lg"
                />
              </div>
            ))}
          </div>
        )}

        <SeriesModal 
          isOpen={openModalId !== null}
          onClose={() => setOpenModalId(null)}
          seriesId={openModalId}
        />
      </div>
    </>
  );
}
