import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import classNames from "classnames";

export interface AdminNavBarPropsType {
  sidebarOpen: boolean;
  setSidebarOpen: (newValue: boolean) => void;
  hideMenu?: boolean;
}

export const AdminNavBar: React.FC<AdminNavBarPropsType> = ({
  setSidebarOpen,
  sidebarOpen,
  hideMenu = false,
}) => {
  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 flex z-40 md:hidden"
          onClose={() => {
            setSidebarOpen(false);
          }}
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
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <img
                    className="block h-8 w-auto"
                    src="/images/sparkle-300.png"
                    alt="Sparkle"
                  />
                </div>
                The mobile menu will eventually go here.
              </div>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14">
            {/* Force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>
      <div className="hidden md:flex md:w-56 md:flex-col md:fixed md:inset-y-0">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <img
                className="block h-8 w-auto"
                src="/images/sparkle-300.png"
                alt="Sparkle"
              />
            </div>
            {hideMenu === false && (
              <nav className="mt-5 flex-1 px-2 space-y-1">
                <h3 className="flex-1 flex flex-col overflow-y-auto px-2 py-1 text-xs text-gray-400 uppercase tracking-wider">
                  TODO: worldName
                </h3>
              </nav>
            )}
          </div>
          <div className="flex-shrink-0">
            <div className="flex-1 flex flex-col overflow-y-auto px-2 py-2">
              <a
                href="switch-world"
                className={classNames(
                  hideMenu
                    ? "text-gray-30 group flex items-center px-2 py-2 text-sm font-medium uppercase tracking-wider rounded-md bg-sparkle text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-2 py-2 text-sm font-regular uppercase tracking-wider rounded-md"
                )}
              >
                TODO: Switch world
              </a>
            </div>
          </div>
          <div className="flex-shrink-0 flex bg-gray-700 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <img
                    className="inline-block h-9 w-9 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">Tom Cook</p>
                  <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                    View profile
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
