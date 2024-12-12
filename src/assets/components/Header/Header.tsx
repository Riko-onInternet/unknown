"use client";

import "./Header.css";

import { useState, useEffect } from "react";

// Utilities
import Link from "next/link";

// Components
import { useCookie } from "@/assets/components/Cookies/CookieProvider";
import Logo from "@/assets/components/Logo";
import Toast from "../Toast";
import predefinedImages from "@/assets/database/imagesProfile";

// NextUI
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tabs,
  Tab,
  DropdownSection,
  Select,
  SelectItem,
  Switch,
} from "@nextui-org/react";

// Icons
import { FaSearch, FaBell, FaFilter } from "react-icons/fa";
import { BsTrash3Fill } from "react-icons/bs";
import {
  RiArchiveStackFill,
  RiHome6Fill,
  RiHome6Line,
  RiBookMarkedFill,
  RiBookMarkedLine,
  RiArchiveStackLine,
  RiQuestionLine,
  RiQuestionFill,
  RiSettings3Fill,
  RiSettings3Line,
  RiCheckDoubleFill,
  RiCheckFill,
} from "react-icons/ri";

export default function Header() {
  const [isActive, setIsActive] = useState({
    home: false,
    archivio: false,
    comics: false,
  });

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const {
    consent,
    setConsent,
    isSubtitlesEnabled,
    setIsSubtitlesEnabled,
    audioLanguage,
    setAudioLanguage,
    subtitleLanguage,
    setSubtitleLanguage,
    profileImage,
    setProfileImage,
  } = useCookie();

  const [toast, setToast] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState(profileImage); // Inizializza con profileImage

  useEffect(() => {
    setSelectedImage(profileImage); // Aggiorna selectedImage quando profileImage cambia
  }, [profileImage]);

  const handleImageSelect = (image: string) => {
    setSelectedImage(image);
  };

  const handleSaveImage = () => {
    setProfileImage(selectedImage); // Aggiorna l'immagine nello stato
    if (consent) {
      // Controlla se il consenso ai cookie è stato dato
      localStorage.setItem("profileImage", selectedImage); // Salva l'immagine nei cookie
      console.log(`Immagine salvata: ${selectedImage}`); // Log dell'URL dell'immagine
    } else {
      console.log(
        "Consenso ai cookie non dato. Immagine non salvata nei cookie."
      );
    }
  };

  useEffect(() => {
    // Funzione per aggiornare lo stato in base al percorso corrente
    function handleRouteChange() {
      const path = window.location.pathname; // Usa window.location.pathname direttamente
      setIsActive({
        home: path === "/",
        archivio: path === "/archivio",
        comics: path === "/comics",
      });
    }

    // Chiamata iniziale per impostare lo stato corretto al montaggio
    handleRouteChange();

    // Aggiungi un listener per cambi di route
    window.addEventListener("popstate", handleRouteChange);

    // Pulizia dell'effetto
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []); // Dipendenze vuote per eseguire solo al montaggio e smontaggio

  const menuItems = [
    {
      name: "Home",
      link: "/",
      icon: isActive.home ? <RiHome6Fill /> : <RiHome6Line />,
      active: isActive.home,
    },
    {
      name: "Archivio",
      link: "/archivio",
      icon: isActive.archivio ? <RiArchiveStackFill /> : <RiArchiveStackLine />,
      active: isActive.archivio,
    },
    {
      name: "Comics",
      link: "/comics",
      icon: isActive.comics ? <RiBookMarkedFill /> : <RiBookMarkedLine />,
      active: isActive.comics,
    },
  ];

  const {
    isOpen: isOpenModalSearch,
    onOpen: onOpenModalSearch,
    onClose: onCloseModalSearch,
    onOpenChange: onOpenChangeModalSearch,
  } = useDisclosure();

  const {
    isOpen: isOpenOptions,
    onOpen: onOpenOptions,
    onClose: onCloseOptions,
    onOpenChange: onOpenChangeOptions,
  } = useDisclosure();

  const {
    isOpen: isOpenDeleteModal,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
    onOpenChange: onOpenChangeDeleteModal,
  } = useDisclosure();

  const {
    isOpen: isOpenChangeAvatar,
    onOpen: onOpenChangeAvatar,
    onClose: onCloseChangeAvatar,
    onOpenChange: onOpenChangeChangeAvatar,
  } = useDisclosure();

  const handleSubtitlesToggle = () => {
    const newValue = !isSubtitlesEnabled;
    setIsSubtitlesEnabled(newValue);
    localStorage.setItem("subtitlesEnabled", JSON.stringify(newValue)); // Salva l'impostazione dei sottotitoli
  };

  const handleAudioLanguageChange = (keys: any) => {
    const selectedLanguage = Array.from(keys)[0] as string; // Ottieni la chiave selezionata
    setAudioLanguage(selectedLanguage);
    localStorage.setItem("audioLanguage", selectedLanguage);
  };

  const handleSubtitleLanguageChange = (keys: any) => {
    const selectedLanguage = Array.from(keys)[0] as string; // Ottieni la chiave selezionata
    setSubtitleLanguage(selectedLanguage); // Aggiorna la lingua dei sottotitoli nel contesto e nei cookie
  };

  const checkCookieConsent = () => {
    if (
      consent === false &&
      !isSubtitlesEnabled &&
      audioLanguage === "it" &&
      subtitleLanguage === "it" &&
      profileImage === "/img/profile/default.png"
    ) {
      setToast(
        "'A schemo! Non hai bisogno di eliminare i dati, perché non hai consentito niente..."
      );
      return;
    } else {
      onOpenDeleteModal();
    }
  };

  const handleDeleteCookies = () => {
    // Rimuovi i cookie dal localStorage
    localStorage.removeItem("cookieConsent");
    localStorage.removeItem("subtitlesEnabled");
    localStorage.removeItem("audioLanguage");
    localStorage.removeItem("subtitleLanguage");
    localStorage.removeItem("profileImage");
    // Aggiorna lo stato per riflettere i cambiamenti
    setConsent(null);
    setIsSubtitlesEnabled(false);
    setAudioLanguage("it");
    setSubtitleLanguage("it");
    setProfileImage("/img/profile/default.png");

    // Riavvia la pagina
    window.location.reload();
  };

  interface ProfileDropdownProps {
    className?: string;
  }

  const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ className }) => {
    return (
      <div className={`profile-top_header items-center gap-2 ${className}`}>
        <Dropdown placement="bottom" className="profile-dropdown">
          <DropdownTrigger>
            <div className="flex flex-col items-center gap-2 backdrop-blur-md p-2 rounded-full cursor-pointer profile">
              <button tabIndex={0} className="avatar">
                <img
                  src={profileImage}
                  className="flex object-cover w-full h-full transition-opacity !duration-500 opacity-0 data-[loaded=true]:opacity-100"
                  alt=""
                  data-loaded="true"
                />
              </button>
            </div>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Profile Actions"
            variant="flat"
            className="bg-transparent"
          >
            {/* Avatar */}
            <DropdownSection showDivider>
              <DropdownItem
                key="avatar"
                className="text-center"
                onClick={onOpenChangeAvatar}
              >
                <div className="flex flex-col items-center gap-2 w-full ">
                  <img src={profileImage} className="preview-avatar" alt="" />
                  <p className="w-full">
                    Clicca qui per modificare il tuo avatar
                  </p>
                </div>
              </DropdownItem>
            </DropdownSection>

            {/* tasti log in e registrazione */}
            <DropdownSection showDivider>
              <DropdownItem
                key="login"
                className="text-center button-login"
                href="/login"
              >
                <button className="w-full">Accedi</button>
              </DropdownItem>
              <DropdownItem
                key="register"
                className="text-center button-register"
                href="/register"
              >
                <button className="w-full">Registrati</button>
              </DropdownItem>
            </DropdownSection>

            {/* Lista */}
            <DropdownItem
              key="list"
              startContent={
                hoveredItem === "list" ? (
                  <RiCheckDoubleFill className="icon_account_dropdown colored" />
                ) : (
                  <RiCheckFill className="icon_account_dropdown" />
                )
              }
              onMouseEnter={() => setHoveredItem("list")}
              onMouseLeave={() => setHoveredItem(null)}
              href="/lista"
            >
              Lista
            </DropdownItem>

            {/* F.A.Q. */}
            <DropdownItem
              key="faq"
              startContent={
                hoveredItem === "faq" ? (
                  <RiQuestionFill className="icon_account_dropdown colored" />
                ) : (
                  <RiQuestionLine className="icon_account_dropdown" />
                )
              }
              onMouseEnter={() => setHoveredItem("faq")}
              onMouseLeave={() => setHoveredItem(null)}
              href="/faq"
            >
              F.A.Q.
            </DropdownItem>

            {/* Impostazioni */}
            <DropdownItem
              key="impostazioni"
              startContent={
                hoveredItem === "impostazioni" ? (
                  <RiSettings3Fill className="icon_account_dropdown colored" />
                ) : (
                  <RiSettings3Line className="icon_account_dropdown" />
                )
              }
              onMouseEnter={() => setHoveredItem("impostazioni")}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={onOpenOptions}
            >
              Impostazioni
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  };

  return (
    <nav>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Header Top */}
      <header className=" z-50 fixed top-0 left-0 w-full header-top">
        <div className="container-header">
          <div className="menu-container">
            {/* Logo */}
            <Logo />

            {/* Menu */}
            <ul className="menu-items gap-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.link}
                    className={`menu-item${
                      item.active ? " menu-item_active" : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-2 min-h-[46px]">
            {/* Search */}
            <button
              className="text-white p-1 text-xl"
              onClick={onOpenModalSearch}
            >
              <FaSearch />
            </button>

            {/* Notification */}
            <Dropdown placement="bottom" className="notification-dropdown">
              <DropdownTrigger>
                <div className="text-white p-1 text-xl cursor-pointer">
                  <FaBell />
                </div>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Profile Actions"
                variant="flat"
                className="bg-transparent"
              >
                <DropdownSection
                  title="Notifiche"
                  id="notifiche"
                  className="text-base"
                >
                  <DropdownItem
                    key="Messaggio vuoto"
                    isReadOnly
                    className="text-center cursor-text user-select-none"
                  >
                    <p>Al momento non ci sono notifiche...</p>
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>

            {/* Profile */}
            <ProfileDropdown className="top" />
          </div>
        </div>
      </header>

      {/* Header Bottom */}
      <div className="menu_bottom fixed bottom-0 left-0 w-full z-50 overflow-hidden">
        <ul className="menu_bottom-items">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link href={item.link} className="flex flex-col items-center p-2">
                <span
                  className={`menu_bottom-icon${
                    item.active ? " menu_bottom-icon_active" : ""
                  }`}
                >
                  {item.icon}
                </span>
                <span className="text-sm sm:text-base">{item.name}</span>
              </Link>
            </li>
          ))}

          {/* Profilo */}
          <li className="flex flex-col items-center justify-center max-h-[63px] h-full">
            <ProfileDropdown className="bottom min-w-[66px] flex justify-center" />
          </li>
        </ul>
      </div>

      {/* Modal Search */}
      <Modal
        isOpen={isOpenModalSearch}
        onOpenChange={onOpenChangeModalSearch}
        backdrop="blur"
        placement="top"
        scrollBehavior="inside"
        classNames={{
          base: "modal-search",
        }}
        size="xl"
      >
        <ModalContent>
          {(onCloseModalSearch) => (
            <>
              <ModalHeader className="flex flex-col gap-4 items-center justify-center">
                <p className="text-2xl font-bold">Cerca</p>
                <div className="flex items-center gap-2">
                  <label
                    className="flex items-center gap-2 cursor-text input-search"
                    htmlFor="search-modal"
                  >
                    <span className="text-white p-1 text-xl">
                      <FaSearch />
                    </span>
                    <input
                      type="text"
                      className="w-full bg-transparent outline-none border-none"
                      id="search-modal"
                      placeholder="Cerca..."
                    />
                  </label>
                  <Dropdown className="background">
                    <DropdownTrigger>
                      <button className="filter-search p-3">
                        <FaFilter />
                      </button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                      <DropdownItem key="new">New file</DropdownItem>
                      <DropdownItem key="copy">Copy link</DropdownItem>
                      <DropdownItem key="edit">Edit file</DropdownItem>
                      <DropdownItem
                        key="delete"
                        className="text-danger"
                        color="danger"
                      >
                        Delete file
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="flex w-full flex-col items-center justify-center">
                  <Tabs
                    aria-label="Search"
                    radius="full"
                    size="lg"
                    classNames={{
                      tabList: "search-tab-list",
                      tab: "search-tab",
                      panel: "search-panel",
                    }}
                  >
                    <Tab key="serietv" title="Serie TV">
                      <p>
                        Ut enim ad minim veniam, quis nostrud exercitation
                        ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        Duis aute irure dolor in reprehenderit in voluptate
                        velit esse cillum dolore eu fugiat nulla pariatur.
                      </p>
                    </Tab>
                    <Tab key="films" title="Films">
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat.
                      </p>
                    </Tab>
                    <Tab key="comics" title="Comics">
                      <p>
                        Excepteur sint occaecat cupidatat non proident, sunt in
                        culpa qui officia deserunt mollit anim id est laborum.
                      </p>
                    </Tab>
                  </Tabs>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal Options */}
      <Modal
        isOpen={isOpenOptions}
        onOpenChange={onOpenChangeOptions}
        backdrop="blur"
        placement="top-center"
        scrollBehavior="inside"
        classNames={{
          base: "modal-settings",
        }}
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Impostazioni
              </ModalHeader>
              <ModalBody className="flex flex-col gap-4">
                {/* Lingua */}
                <Select
                  label="Lingua audio"
                  disallowEmptySelection
                  labelPlacement="outside"
                  placeholder="Seleziona una lingua"
                  className="w-full input-settings"
                  selectedKeys={[audioLanguage]}
                  onSelectionChange={handleAudioLanguageChange}
                >
                  <SelectItem key={"it"}>Italiano</SelectItem>
                  <SelectItem key={"en"}>Inglese</SelectItem>
                </Select>

                <div className="sottotitoli-options">
                  {/* Attivare i sottotitoli */}
                  <div className="flex items-center justify-between w-full active-subtitles">
                    <p>Attiva i sottotitoli</p>
                    <Switch
                      isSelected={isSubtitlesEnabled}
                      onChange={handleSubtitlesToggle}
                      size="sm"
                    />
                  </div>

                  {/* Sottotitoli */}
                  <Select
                    label="Lingua sottotitoli"
                    disallowEmptySelection
                    labelPlacement="outside"
                    placeholder="Seleziona una lingua"
                    className="w-full input-settings"
                    selectedKeys={[subtitleLanguage]}
                    onSelectionChange={handleSubtitleLanguageChange}
                    isDisabled={!isSubtitlesEnabled}
                  >
                    <SelectItem key="it">Italiano</SelectItem>
                    <SelectItem key="en">Inglese</SelectItem>
                  </Select>
                </div>

                <hr className="opacity-50 " />

                <button
                  className="btn-delete w-full"
                  onClick={checkCookieConsent}
                >
                  <BsTrash3Fill />
                  Elimina i dati
                </button>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal Elimina i dati */}
      <Modal
        isOpen={isOpenDeleteModal}
        onOpenChange={onOpenChangeDeleteModal}
        backdrop="blur"
        placement="top-center"
        scrollBehavior="inside"
        classNames={{
          base: "modal-delete",
        }}
      >
        <ModalContent>
          {(onCloseDeleteModal) => (
            <>
              <ModalHeader className="delete-modal-header">
                Sei sicuro di voler eliminare i dati?
              </ModalHeader>
              <ModalBody className="flex flex-col gap-0">
                <p>I dati che verranno eliminati sono:</p>
                <ul className="list-delete">
                  <li>L'avatar</li>
                  <li>
                    La traccia audio (se avete messo come predefinito un'altra
                    lingua, sennò rimane l'italiano)
                  </li>
                  <li>L'attivazione dei sottotitoli</li>
                  <li>La lingua dei sottotitoli</li>
                  <li>La lista</li>
                  <li>La cronologia</li>
                  <li>Le serie, film e fumetti che avete già visionato</li>
                </ul>
              </ModalBody>
              <ModalFooter className="delete-modal-footer">
                <Button aria-label="Annulla" onPress={onCloseDeleteModal}>
                  Annulla
                </Button>
                <Button aria-label="Elimina" onPress={handleDeleteCookies}>
                  Elimina
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal Change Avatar */}
      <Modal
        isOpen={isOpenChangeAvatar}
        onOpenChange={onOpenChangeChangeAvatar}
        backdrop="blur"
        placement="top-center"
        scrollBehavior="inside"
        classNames={{ base: "modal-change-avatar mx-0" }}
        size="xl"
      >
        <ModalContent>
          {(onCloseChangeAvatar) => (
            <>
              <ModalHeader className="text-center">
                <span className="w-full">Cambia l'avatar</span>
              </ModalHeader>
              <ModalBody className="modal-body-change-avatar">
                {predefinedImages.map((image, index) => (
                  <>
                    <div className="avatar-container">
                      <div className="avatar-name">{image.name}</div>
                      <div className="avatar-content">
                        <div className="avatar-content-container">
                          {image.images.map((img, idx) => (
                            <div>
                              <button
                                key={idx}
                                onClick={() =>
                                  handleImageSelect(
                                    `/img/profile/${image.url}${img.url}`
                                  )
                                }
                                className={`avatar-button ${
                                  selectedImage ===
                                  `/img/profile/${image.url}${img.url}`
                                    ? "selected"
                                    : ""
                                }`}
                                title={img.name || "Avatar"}
                              >
                                <img
                                  src={`/img/profile/${image.url}${img.url}`}
                                  alt={img.name || "Avatar"}
                                />
                              </button>
                              <span className="text-center w-full block">
                                {img.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              </ModalBody>
              <ModalFooter className="modal-footer-change-avatar">
                <Button
                  onPress={onCloseChangeAvatar}
                  aria-label="annulla_avatar"
                >
                  Annulla
                </Button>
                <Button
                  onPress={() => {
                    handleSaveImage();
                    onCloseChangeAvatar();
                  }}
                  aria-label="salva_avatar"
                >
                  Salva
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </nav>
  );
}
