"use client";
import { useState, useEffect } from "react";

import Header from "@/assets/components/Header";
import "@/assets/css/bg_series.css";
import seriesDatabase from "@/assets/database/series-database";

import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  Button,
  Tabs,
  Tab,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Skeleton,
} from "@nextui-org/react";

import {
  RiStarFill,
  RiPlayLargeFill,
  RiBookmarkFill,
  RiBookmarkLine,
} from "react-icons/ri";

// Definisci l'interfaccia per i dati della serie
interface Serie {
  Name: string;
  autor: { name: string; img: string }[];
  linkName: string;
  id: string;
  startYear: string;
  endYear: string;
  seasons: number;
  sinossi: string;
  apiRate: string;
  linguage: string;
  subtitle: { name: string; id: string }[];
  cast: { name: string; id: string }[];
  generi: { name: string; id: string }[];
  episodes: {
    season: number;
    episodes: {
      [x: string]: string | undefined;
      title: string;
      id: string;
      link: string;
    }[];
  }[];
  bg: string;
  m3u8: string;
  tabs: { title: string; content?: { title: string }[] }[];
  IMDbID: string;
  trailer: { title: string; link: string; img: string }[];
}

// Funzione per simulare il recupero dei dati dal database
const fetchSeriesData = async () => {
  // Simula una chiamata API al tuo database
  return seriesDatabase;
};

export default function Home() {
  const [series, setSeries] = useState<Serie[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<Record<string, number>>(
    {}
  );
  const [openModalId, setOpenModalId] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const loadSeries = async () => {
      const data = await fetchSeriesData();
      setSeries(data as unknown as Serie[]);
      const initialSeasons = (data as unknown as Serie[]).reduce(
        (acc, serie) => {
          acc[serie.id] = 1;
          return acc;
        },
        {} as Record<string, number>
      );
      setSelectedSeason(initialSeasons);
    };

    loadSeries();
  }, []);

  const openModal = (id: string) => {
    setOpenModalId(id);
  };

  const closeModal = () => {
    setOpenModalId(null);
  };

  return (
    <>
      <Header />

      {series.map((serie) => (
        <Button key={serie.id} onPress={() => openModal(serie.id)}>
          {serie.Name}
        </Button>
      ))}

      {series.map((serie) => (
        <Modal
          key={serie.id}
          isOpen={openModalId === serie.id}
          size="2xl"
          onOpenChange={closeModal}
          className="modButtonClose overflow-hidden my-1"
          placement="top"
          scrollBehavior="outside"
          backdrop="blur"
        >
          <ModalContent>
            <ModalBody className="modal-body-series bg-tertiary">
              <div className="relative h-max">
                <div className={"bg-series " + serie.bg}></div>

                <div className="absolute pl-6 sm:pl-[50px] bottom-0 left-0 w-full linear-bottom">
                  <div className="flex flex-col gap-3 mb-6">
                    <div className="w-[250px]">
                      <img
                        src={
                          "/img/modalseries/" + serie.id + "/logo.png"
                        }
                        alt={serie.Name}
                      />
                    </div>

                    {Array.isArray(serie.autor) && serie.autor.length > 1 ? (
                      <div className="flex gap-2">
                        {serie.autor.map((author, index) => (
                          <div key={author.name} className="author">
                            <img
                              src={"/img/creators/" + author.img + ".avif"}
                            />
                            <p>{author.name}</p>
                            {index < serie.autor.length - 1 && <span>&</span>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      serie.autor.map((author) => (
                        <div key={author.name} className="author">
                          <img src={"/img/creators/" + author.img + ".avif"} />
                          <p>{author.name}</p>
                        </div>
                      ))
                    )}

                    <a
                      href={"https://www.imdb.com/title/" + serie.IMDbID}
                      target="_blank"
                      rel="noreferrer"
                      className="rating-IMDb"
                    >
                      <RiStarFill className="size-6 mr-2" />
                      <p className="mt-1">8.1/10</p>
                      <img
                        src="https://streamy.sirv.com/Imdb-logo.png"
                        alt="IMDb"
                        className="w-[40px] ml-2.5"
                      />
                    </a>

                    <div className="input-series">
                      <button aria-label="play">
                        <RiPlayLargeFill />
                        <p>Play</p>
                      </button>
                      <button aria-label="list">
                        <RiBookmarkLine />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 pb-3">
                <Tabs radius="full" size="lg" className="bg-tabs">
                  {serie.tabs.map((tab, index) => (
                    <Tab key={index} title={tab.title} className="px-3">
                      <div className="content-tab">
                        {tab.title === "Panoramica" && (
                          <div
                            className="max-w-[500px] w-full mx-auto mt-2"
                            id="content-panoramica"
                          >
                            {Array.isArray(tab.content) &&
                              tab.content.map((content) => (
                                <div
                                  className="flex flex-col"
                                  key={content.title}
                                >
                                  <p className="text-lg font-bold text-primary leading-normal">
                                    {content.title}
                                  </p>
                                  {content.title === "Stagioni" && (
                                    <p>
                                      {serie.seasons}{" "}
                                      {serie.seasons > 1
                                        ? "Stagioni"
                                        : "Stagione"}
                                    </p>
                                  )}
                                  {content.title === "Anno" && (
                                    <p>
                                      {serie.startYear} - {serie.endYear}
                                    </p>
                                  )}
                                  {content.title === "Sinossi" && (
                                    <p>{serie.sinossi}</p>
                                  )}
                                  {content.title === "Cast" && (
                                    <div className="flex flex-col">
                                      {serie.cast.slice(0, 3).map((person) => (
                                        <div
                                          key={person.id}
                                          className="flex flex-col"
                                        >
                                          <a
                                            href={`https://www.imdb.com/name/${person.id}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-max"
                                          >
                                            {person.name}
                                          </a>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  {content.title === "Generi" && (
                                    <div className="flex flex-col">
                                      {serie.generi
                                        .slice(0, 3)
                                        .map((generi) => (
                                          <div
                                            key={generi.id}
                                            className="flex flex-col"
                                          >
                                            {generi.name}
                                          </div>
                                        ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        )}

                        {tab.title === "Episodi" && (
                          <div className="mt-4">
                            {serie.episodes.length > 1 && (
                              <div className="w-full flex justify-end">
                                <Dropdown>
                                  <DropdownTrigger>
                                    <Button variant="bordered">
                                      Stagione {selectedSeason[serie.id]}
                                    </Button>
                                  </DropdownTrigger>
                                  <DropdownMenu
                                    aria-label="Seleziona Stagione"
                                    onAction={(key) =>
                                      setSelectedSeason((prev) => ({
                                        ...prev,
                                        [serie.id]: Number(key),
                                      }))
                                    }
                                  >
                                    {serie.episodes.map((season) => (
                                      <DropdownItem
                                        key={season.season}
                                        aria-label={`Stagione ${season.season}`}
                                      >
                                        Stagione {season.season}
                                      </DropdownItem>
                                    ))}
                                  </DropdownMenu>
                                </Dropdown>
                              </div>
                            )}

                            <div
                              className="flex flex-col gap-4"
                              id="content-episodes"
                            >
                              {serie.episodes
                                .find(
                                  (season) =>
                                    season.season === selectedSeason[serie.id]
                                )
                                ?.episodes.map((episode) => (
                                  <>
                                    <a
                                      href={episode.link}
                                      key={episode.id}
                                      className={`w-full h-auto sm:h-[140px] md:h-[110px] flex items-start flex-col md:flex-row gap-2 episode-card ${
                                        episode.link === ""
                                          ? "episode-disabled"
                                          : ""
                                      }`}
                                    >
                                      <div className="flex flex-col items-center sm:flex-row w-full h-full gap-4 md:pr-3">
                                        <p className="hidden sm:flex poppins text-3xl max-w-[36px] w-full max-h-[36px] items-center justify-center">
                                          {episode.nEp}
                                        </p>
                                        <div className="w-full sm:h-[100px] sm:w-auto md:h-full md:w-[150px] aspect-video">
                                          <Skeleton
                                            className={`aspect-video w-full sm:w-auto md:w-[150px] rounded-[6px] ${
                                              imageLoaded ? "hidden" : ""
                                            }`}
                                          />
                                          <img
                                            src={`/img/modalseries/${episode.img}.avif`}
                                            alt={episode.title}
                                            className={`w-full sm:h-[100px] sm:w-auto md:h-full md:w-[150px] ${
                                              imageLoaded ? "" : "hidden"
                                            }`}
                                            onLoad={() => {
                                              setImageLoaded(true);
                                            }}
                                          />
                                        </div>
                                        <div className="flex flex-col gap-2 h-max w-full md:w-[calc(100%-150px)]">
                                          <p className="flex justify-between items-center">
                                            <span className="text-lg sm:text-xl leading-normal">
                                              <span className="sm:hidden poppins">
                                                {episode.nEp}.&nbsp;
                                              </span>
                                              <span className="font-bold sm:line-clamp-1">
                                                {episode.title}
                                              </span>
                                            </span>
                                            <span className="text-sm sm:text-lg hidden md:block">
                                              <span className="poppins">
                                                {episode.minutes}
                                              </span>
                                              min
                                            </span>
                                          </p>
                                          <p className="leading-normal md:hidden">
                                            {episode.minutes}min
                                          </p>
                                          <p className="hidden sm:line-clamp-2">
                                            {episode.description}
                                          </p>
                                        </div>
                                      </div>
                                      <p className="leading-normal sm:hidden">
                                        {episode.description}
                                      </p>
                                    </a>
                                  </>
                                ))}
                            </div>
                          </div>
                        )}

                        {tab.title === "Dettagli" && (
                          <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 max-w-[500px] w-full mx-auto">
                            <div className="flex flex-col">
                              <p className="text-lg font-bold text-primary leading-normal">
                                Cast
                              </p>
                              {serie.cast.map((person) => (
                                <div key={person.id} className="flex flex-col">
                                  <a
                                    href={`https://www.imdb.com/name/${person.id}`}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {person.name}
                                  </a>
                                </div>
                              ))}
                            </div>

                            <div className="flex flex-col">
                              <p className="text-lg font-bold text-primary leading-normal">
                                Generi
                              </p>
                              {serie.generi.map((generi) => (
                                <div key={generi.id} className="flex flex-col">
                                  {generi.name}
                                </div>
                              ))}
                            </div>

                            <div className="flex flex-col">
                              <p className="text-lg font-bold text-primary leading-normal">
                                Lingua
                              </p>
                              <p>{serie.linguage}</p>
                            </div>

                            {serie.subtitle && serie.subtitle.length > 0 && (
                              <div className="flex flex-col">
                                <p className="text-lg font-bold text-primary leading-normal">
                                  Sottotitoli
                                </p>
                                {serie.subtitle.map((subtitle) => (
                                  <div
                                    key={subtitle.id}
                                    className="flex flex-col"
                                  >
                                    {subtitle.name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {tab.title === "Shorts" && (
                          <div>
                            <p>Contenuto per il tab Shorts</p>
                          </div>
                        )}

                        {tab.title === "Trailer" && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-4 mt-4">
                            {serie.trailer
                              .slice()
                              .reverse()
                              .map((trailer) => (
                                <a
                                  href={trailer.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  key={trailer.title}
                                  className="flex flex-col gap-2 max-w-[366px] mx-auto"
                                >
                                  <img
                                    src={`/img/modalseries/${serie.id}/trailers/${trailer.img}.avif`}
                                    alt={trailer.title}
                                    className="rounded-lg mx-auto"
                                  />
                                  <p className="text-center">{trailer.title}</p>
                                </a>
                              ))}
                          </div>
                        )}
                      </div>
                    </Tab>
                  ))}
                </Tabs>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      ))}
    </>
  );
}
