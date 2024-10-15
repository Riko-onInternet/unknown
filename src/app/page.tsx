"use client";
import { useState, useEffect } from "react";

import Header from "@/assets/components/Header";
import "@/assets/css/bg_series.css";

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
  return [
    {
      Name: "The Amazing Digital Circus",
      autor: [
        {
          name: "Gooseworx",
          img: "https://yt3.googleusercontent.com/PQepFs89fnCtJ76MehFBBaY5bmjiDWYgQWQacKnXmxtqZKliEoLvjcErPhO5dXhyr_S8N9hB=s176-c-k-c0x00ffffff-no-rj-mo",
        },
      ],
      linkName: "the-amazing-digital-circus",
      id: "TADC",
      startYear: "2024",
      endYear: "",
      seasons: 1,
      sinossi:
        "The Amazing Digital Circus è una commedia dark psicologica e parla di una donna che rimane intrappolata in un folle mondo virtuale insieme ad altri cinque umani e ora è soggetta ai capricci di una stravagante intelligenza artificiale e ai propri traumi personali.",
      apiRate: "",
      linguage: "Inglese",
      IMDbID: "tt1234567",
      bg: "TADC_bg",
      m3u8: "tadc.m3u8",
      subtitle: [
        {
          name: "Italiano",
          id: "Italiano",
        },
        {
          name: "Inglese",
          id: "Inglese",
        },
      ],
      cast: [
        {
          name: "Lizzie Freeman",
          id: "nm5213242",
        },
        {
          name: "Michael Kovach",
          id: "nm7693469",
        },
        {
          name: "Marissa Lenti",
          id: "nm6705101",
        },
      ],
      generi: [
        {
          name: "Animazione",
          id: "Animazione",
        },
        {
          name: "Avventura",
          id: "Avventura",
        },
        {
          name: "Commedia",
          id: "Commedia",
        },
        {
          name: "Fantastico",
          id: "Fantastico",
        },
        {
          name: "Horror",
          id: "Horror",
        },
        {
          name: "Fantascienza",
          id: "Fantascienza",
        },
      ],
      episodes: [
        {
          season: 1,
          episodes: [
            {
              nEp: 1,
              title: "Il mondo fantastico (Pilota)",
              id: "TADC_S1E1",
              description:
                "Una ragazza viene intrappolata in un circo completamente digitale e cercherà in ogni modo di scappare da quel assurdo posto",
              link: "",
              minutes: "23",
              img: "https://i.ytimg.com/vi/HwAPLk_sQ3w/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAra5fd3lv0Z1TDLqHCE-sxqamH_w",
            },
            {
              nEp: 2,
              title: "Episodio 2",
              id: "TADC_S1E2",
              description: "//",
              link: "",
              minutes: "23",
              img: "https://i.ytimg.com/vi/4ofJpOEXrZs/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCXa2VADexFr0_birYRwhPVqiWteg",
            },
            {
              nEp: 3,
              title: "Episodio 3",
              id: "TADC_S1E3",
              description: "//",
              link: "",
              minutes: "23",
              img: "https://i.ytimg.com/vi/bKjfw77cxeQ/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBAtm6Qzbkr-6I0dePJ_xZxp6Dt5Q",
            },
          ],
        },
      ],
      trailer: [
        {
          title: "THE AMAZING DIGITAL CIRCUS [OFFICIAL TRAILER]",
          link: "https://youtu.be/iuaRQ5NQFq8?si=ckcUWWjeKCVlCxzc",
          img: "https://i.ytimg.com/vi/iuaRQ5NQFq8/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLA7-4GAlf0ZWgUs5G-JQH5KbVo_aA",
        },
        {
          title: "UP NEXT ON THE AMAZING DIGITAL CIRCUS...",
          link: "https://youtu.be/rafQwY9n_M0?si=eMKIatcLSsZ7bVZE",
          img: "https://i.ytimg.com/vi/rafQwY9n_M0/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLC_lcYOO1gnMp6iIsW3VzeQFbTXpg",
        },
        {
          title: "VIEWER BEWARE... DIGITAL CIRCUS EPISODE 3 IS NEAR!",
          link: "https://youtu.be/x287j7Vby0U?si=nflBGft-VB61euiL",
          img: "https://i.ytimg.com/vi/x287j7Vby0U/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLChKwhc5h2EHt9kPT7PKEH1j43NHQ",
        },
      ],

      tabs: [
        {
          title: "Panoramica",
          content: [
            {
              title: "Stagioni",
            },
            {
              title: "Anno",
            },
            {
              title: "Sinossi",
            },
            {
              title: "Cast",
            },
            {
              title: "Generi",
            },
          ],
        },
        {
          title: "Episodi",
        },
        {
          title: "Dettagli",
        },
        {
          title: "Trailer",
        },
      ],
    },
  ];
};
export default function Home() {
  const [series, setSeries] = useState<Serie[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<Record<string, number>>(
    {}
  );
  const [openModalId, setOpenModalId] = useState<string | null>(null);

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
                          "https://streamy.sirv.com/logos/" + serie.id + ".png"
                        }
                        alt={serie.Name}
                      />
                    </div>

                    {Array.isArray(serie.autor) &&
                      serie.autor.map((author) => (
                        <div key={author.name} className="author">
                          <img src={author.img} />
                          <p>{author.name}</p>
                        </div>
                      ))}

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

              <div className="px-4 pb-3 prova">
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
                                  <a
                                    // href={episode.link}
                                    key={episode.id}
                                    className="w-full flex items-start flex-col md:flex-row gap-2 episode-card"
                                  >
                                    <div className="flex flex-col items-center sm:flex-row gap-4 w-full pr-3">
                                      <p className="hidden sm:flex poppins text-3xl w-[36px] h-[36px] items-center justify-center">
                                        {episode.nEp}
                                      </p>
                                      <img
                                        src={episode.img}
                                        alt={episode.title}
                                        className="w-full sm:h-[100px] sm:w-auto md:h-auto md:w-[150px]"
                                      />
                                      <div className="flex flex-col gap-2 h-max w-full">
                                        <p className="flex justify-between items-center">
                                          <span className="text-lg sm:text-xl leading-normal">
                                            <span className="sm:hidden poppins">
                                              {episode.nEp}.&nbsp;
                                            </span>
                                            <span className="font-bold">
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
                                    src={trailer.img}
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