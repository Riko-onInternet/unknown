"use client";

import { useState, useEffect } from "react";

// Image
import Image from "next/image";
import Link from "next/link";

// NextUI
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Tabs,
  Tab,
} from "@nextui-org/react";

// Icons
import { FaSearch, FaBell, FaHome, FaFilter } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import {
  RiArchiveStackFill,
  RiHome6Fill,
  RiHome6Line,
  RiBookMarkedFill,
  RiBookMarkedLine ,
  RiArchiveStackLine,
} from "react-icons/ri";

export default function Header() {
  const [isActive, setIsActive] = useState({
    home: false,
    archivio: false,
    comics: false,
  });

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
      icon: isActive.comics ? <RiBookMarkedFill /> : <RiBookMarkedLine  />,
      active: isActive.comics,
    },
  ];

  const {
    isOpen: isOpenModalSearch,
    onOpen: onOpenModalSearch,
    onClose: onCloseModalSearch,
    onOpenChange: onOpenChangeModalSearch,
  } = useDisclosure();

  return (
    <nav>
      {/* Header Top */}
      <header className=" z-50 fixed top-0 left-0 w-full header-top">
        <div className="container-header">
          <div className="menu-container gap">
            <Image
              src="/img/logo-variant-1.png"
              alt="logo"
              height={60}
              width={316}
              className="full-logo"
            />
            <Image
              src="/img/icon.png"
              alt="logo"
              height={30}
              width={90}
              className="icon-logo"
            />
            <ul className="menu-items gap-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <a href={item.link}>{item.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              className="text-white p-1 text-xl"
              onClick={onOpenModalSearch}
            >
              <FaSearch />
            </button>

            {/* Notification */}
            <Dropdown placement="bottom-start">
              <DropdownTrigger>
                <div className="text-white p-1 text-xl">
                  <FaBell />
                </div>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Profile Actions"
                variant="flat"
                className="bg-black"
              >
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">zoey@example.com</p>
                </DropdownItem>
                <DropdownItem key="settings">My Settings</DropdownItem>
                <DropdownItem key="team_settings">Team Settings</DropdownItem>
                <DropdownItem key="analytics">Analytics</DropdownItem>
                <DropdownItem key="system">System</DropdownItem>
                <DropdownItem key="configurations">Configurations</DropdownItem>
                <DropdownItem key="help_and_feedback">
                  Help & Feedback
                </DropdownItem>
                <DropdownItem key="logout" color="danger">
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>

            {/* Profile */}
            <div className="flex items-center gap-2">
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <div className="profile flex items-center gap-2 backdrop-blur-md p-2 rounded-full cursor-pointer">
                    <Avatar
                      isBordered
                      as="button"
                      className="transition-transform"
                      src="/img/profile/default.png"
                      size="sm"
                    />
                    <IoIosArrowDown />
                  </div>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Profile Actions"
                  variant="flat"
                  className="bg-black"
                >
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">zoey@example.com</p>
                  </DropdownItem>
                  <DropdownItem key="settings">My Settings</DropdownItem>
                  <DropdownItem key="team_settings">Team Settings</DropdownItem>
                  <DropdownItem key="analytics">Analytics</DropdownItem>
                  <DropdownItem key="system">System</DropdownItem>
                  <DropdownItem key="configurations">
                    Configurations
                  </DropdownItem>
                  <DropdownItem key="help_and_feedback">
                    Help & Feedback
                  </DropdownItem>
                  <DropdownItem key="logout" color="danger">
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>
      </header>

      {/* Header Bottom */}
      <div className="menu_bottom fixed bottom-0 left-0 w-full menu-bottom z-50 overflow-hidden">
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
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
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
    </nav>
  );
}
