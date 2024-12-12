"use client";

// React
import { useState, useEffect } from "react";

// import Swiper core and required modules
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

// Components
import Header from "@/assets/components/Header/Header";
import seriesDatabase from "@/assets/database/series-database";
import "@/assets/css/carousel.css";
import "@/assets/css/bg_series.css";
import { useCookie } from "@/assets/components/Cookies/CookieProvider";
import SeriesModal from "@/assets/components/SeriesModal";

// Definisci l'interfaccia per i dati della serie
interface Serie {
  Name: string;
  autor: { name: string; img: string }[];
  linkName: string;
  id: string;
  year: {
    start: string;
    end: string;
    status: string;
  }[];
  seasons: number;
  sinossi: string;
  apiRate: string;
  linguage: { name: string; id: string }[];
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
  const { savedSeries, toggleSavedSeries } = useCookie();

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

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) =>
          console.log("Service Worker registrato:", registration)
        )
        .catch((error) => console.log("Errore Service Worker:", error));
    }
  }, []);

  const openModal = (id: string) => {
    setOpenModalId(id);
  };

  const closeModal = () => {
    setOpenModalId(null);
  };

  const contentSlider = [
    {
      title: "The Amazing Digital Circus",
      id: "tadc",
      pc: "/img/carousel/pc/tadc_slider_pc.avif",
      mobile: "/img/carousel/mobile/tadc_slider_mobile.avif",
      tablet: "/img/carousel/tablet/tadc_slider_tablet.avif",
    },
    {
      title: "Murder Drones",
      id: "murder_drones",
      pc: "/img/carousel/pc/murder_drones_slider_pc.avif",
      mobile: "/img/carousel/mobile/murder_drones_slider_mobile.avif",
      tablet: "/img/carousel/tablet/murder_drones_slider_tablet.avif",
    },
  ];

  return (
    <>
      <Header />

      <Swiper
        // install Swiper modules
        modules={[Navigation, Pagination, A11y, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        loop={true}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 4000, // 4 secondi
          disableOnInteraction: false,
        }}
        className="relative z-10"
      >
        {contentSlider.map((item) => (
          <SwiperSlide key={item.id}>
            <div
              onClick={() => openModal(item.id)}
              id="content-slider"
              className="cursor-pointer"
            >
              <div className="content-img">
                <img src={item.pc} alt="slider" dara-device="pc" />
                <img src={item.tablet} alt="slider" dara-device="tablet" />
                <img src={item.mobile} alt="slider" dara-device="mobile" />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <SeriesModal
        isOpen={openModalId !== null}
        onClose={closeModal}
        seriesId={openModalId}
      />
    </>
  );
}
