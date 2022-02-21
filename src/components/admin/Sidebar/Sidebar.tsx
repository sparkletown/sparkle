import React, { Fragment } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";

import { SidebarContent } from "./components/SidebarContent";

export interface SidebarProps {
  sidebarOpen: boolean;
  onCloseSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onCloseSidebar,
  sidebarOpen,
}) => (
  <div className="Sidebar">
    <Transition.Root show={sidebarOpen} as={Fragment}>
      <Dialog
        as="div"
        className="Sidebar__modal fixed inset-0 flex z-40 md:hidden"
        onClose={onCloseSidebar}
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="transition ease-in-out duration-300 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800">
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={onCloseSidebar}
                >
                  <span className="sr-only">Close sidebar</span>
                  <FontAwesomeIcon
                    className="h-6 w-6 text-white"
                    icon={faTimes}
                  />
                </button>
              </div>
            </Transition.Child>

            <SidebarContent />
          </div>
        </Transition.Child>

        <div className="flex-shrink-0 w-14">
          {/* Force sidebar to shrink to fit close icon */}
        </div>
      </Dialog>
    </Transition.Root>

    <div className="Sidebar__desktop hidden md:flex md:w-56 md:flex-col md:fixed md:inset-y-0">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <SidebarContent />
    </div>
  </div>
);
