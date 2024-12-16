"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import seriesDatabase from "@/assets/database/series-database";

// componenti
import SeriesModal from "@/assets/components/SeriesModal";
import Header from "@/assets/components/Header/Header";

interface Author {
  name: string;
  img: string;
  autorImgs?: { urlImg: string }[];
}

export default function AutorePage() {
  const params = useParams();
  const name = decodeURIComponent(params.name as string);
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtra le serie in base al nome dell'autore
  const seriesByAuthor = seriesDatabase.filter((serie) =>
    serie.autor.some((author) => author.name === name)
  );

  const filteredSeries = seriesByAuthor.filter((serie) =>
    serie.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {seriesByAuthor.length === 0 ? (
        <p className="text-center text-lg text-gray-500">
          Nessuna serie trovata per questo autore.
        </p>
      ) : (
        <>
          <Header />

          <div className="w-full h-[350px] flex items-center justify-center relative">
            <p className="relative z-10 text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-white tracking-widest">
              {name}
            </p>
            <div className="absolute z-0 bottom-0 left-0 w-full h-full bg-gradient-to-t from-transparent bg-black opacity-50">
              <div className="relative w-full h-full">
                <div className="w-full h-full absolute top-0 left-0">
                  <div className="grid grid-cols-4 h-full overflow-hidden">
                    {seriesByAuthor.map((serie) => (
                      <>
                        {serie.autor
                          .filter((author: Author) => author.name === name)
                          .map((author: Author) =>
                            author.autorImgs?.map((img, index) => (
                              <img
                                key={`${serie.id}-${index}`}
                                src={`/img/creators/${author.img}/${img.urlImg}`}
                                className="object-cover object-center w-full h-full"
                              />
                            ))
                          )}
                      </>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            <div className="mb-6 w-max mx-auto">
              <input
                type="text"
                placeholder="Cerca serie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[var(--unknown-background-secondary)] p-2 rounded-lg max-w-[300px] w-full"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredSeries.map((serie) => (
                <div
                  key={serie.id}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setOpenModalId(serie.id)}
                >
                  <img
                    src={`/img/carousel/mobile/${serie.id}_slider_mobile.avif`}
                    alt={serie.Name}
                    className="w-full rounded-lg outline outline-3 -outline-offset-2 outline-transparent hover:outline-offset-4 hover:outline-[var(--unknown-primary)] transition-all duration-300"
                  />
                  <p className="mt-2 text-center text-lg font-semibold">{serie.Name}</p>
                </div>
              ))}
            </div>

            <SeriesModal
              isOpen={openModalId !== null}
              onClose={() => setOpenModalId(null)}
              seriesId={openModalId}
            />
          </div>
        </>
      )}
    </>
  );
}
