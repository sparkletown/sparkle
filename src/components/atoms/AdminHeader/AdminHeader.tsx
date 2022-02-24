import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import classNames from "classnames";

import { HeaderButtonProps } from "components/admin/HeaderButton/HeaderButton";

// TODO
// import TabsFullWidth from "./tabs-full-width";

interface Crumb {
  name: string;
  href: string;
}

interface Subtitle {
  text: string;
  icon: (props: React.ComponentProps<"svg">) => JSX.Element;
}

interface HeaderProps {
  title: string;
  crumbtrail?: Crumb[];
  subtitleItems?: Subtitle[];
  children?:
    | React.ReactElement<HeaderButtonProps>
    | React.ReactElement<HeaderButtonProps>[];
}

export const AdminHeader: React.FC<HeaderProps> = ({
  title,
  crumbtrail,
  subtitleItems,
  children = [],
}: HeaderProps) => {
  //const tabNames = props.tabNames;
  //const currentTab = props.currentTab;
  //const onTabClick = props.onTabClick;
  const headerButtons = Array.isArray(children) ? children : [children];

  return (
    <header className="bg-white shadow px-4 sm:px-6 pt-4 sm:pt-6">
      <div className="lg:flex lg:items-center lg:justify-between pb-6">
        <div className="flex-1 min-w-0">
          <nav className="flex" aria-label="Breadcrumb">
            {crumbtrail && (
              <ol className="flex items-center space-x-4">
                {crumbtrail.map((item) => (
                  <li key={item.name}>
                    <div className="flex items-center">
                      <a
                        href={item.href}
                        className="text-sm font-medium text-gray-500 hover:text-gray-700"
                      >
                        {item.name}
                      </a>
                      <svg
                        className="ml-2 flex-shrink-0 h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                      </svg>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </nav>
          <h2 className="mt-2 text-3xl font-medium leading-7 text-gray-900 sm:text-4xl sm:truncate">
            {title}
          </h2>
          {subtitleItems && (
            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
              {subtitleItems.map((item) => (
                <div
                  key={item.text}
                  className="mt-2 flex items-center text-sm text-gray-500"
                >
                  <item.icon
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  {item.text}
                </div>
              ))}
            </div>
          )}
        </div>
        {headerButtons && (
          <div className="mt-5 flex lg:mt-0 lg:ml-4">
            {headerButtons.map((headerButton, index) => (
              <span
                key={headerButton.props.name}
                className={classNames(
                  index > 0 ? "sm:ml-3" : "",
                  "hidden sm:block"
                )}
              >
                {headerButton}
              </span>
            ))}
            {/* Dropdown for small screens */}
            <Menu as="span" className="relative sm:hidden">
              <Menu.Button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                More
                <ChevronDownIcon
                  className="-mr-1 ml-2 h-5 w-5 text-gray-500"
                  aria-hidden="true"
                />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute left-0 mt-2 -mr-1 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {headerButtons.map((headerButton) => (
                    <Menu.Item key={headerButton.props.name}>
                      {({ active }) => (
                        <a
                          href={headerButton.props.to}
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          {headerButton.props.name}
                        </a>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        )}
      </div>
      {/*
      TODO implement this
      Header.defaultProps = {
        tabNames: [],
        currentTab: "",
        onTabClick: function (tabName) {
          return;
        },
      };

      <TabsFullWidth
        tabNames={tabNames}
        currentTab={currentTab}
        onTabClick={onTabClick}
      ></TabsFullWidth>
      */}
    </header>
  );
};
