import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "components/admin/Button";

import { STRING_SPACE, STRING_ZERO_WIDTH_SPACE } from "settings";

import { useProfileModalControls } from "hooks/useProfileModalControls";

export const AdminProfileModal = () => {
  const {
    hasSelectedProfile,
    closeUserProfileModal,
  } = useProfileModalControls();

  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={hasSelectedProfile} as={Fragment}>
      <Dialog
        as="div"
        className="AdminProfileModal fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={closeUserProfileModal}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            {STRING_ZERO_WIDTH_SPACE}
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-middle bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-left sm:mt-0">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    My profile
                  </Dialog.Title>
                  <div>
                    <div className="mt-7 mb-5 flex flex-row gap-3">
                      <div className="flex-shrink-0 h-20 w-20">
                        <img
                          alt=""
                          className="rounded-full w-20 h-20"
                          src="https://images.unsplash.com/photo-1504257432389-52343af06ae3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80"
                        />
                      </div>
                      <div className="flex flex-col">
                        <h2 className="font-sm">Tom Cook</h2>
                        <p className="font-sm text-gray-700">
                          tomcook@hotmail.co.uk
                        </p>
                        <span className="font-xs">
                          is busy{STRING_SPACE}
                          <a href="/" className="underline font-xs">
                            Change status
                          </a>
                        </span>
                      </div>
                    </div>
                    <div>
                      <span>What level of English do you have?</span>
                      <p>Excellent!</p>
                    </div>
                    <div>
                      <span>Where are you from?</span>
                      <p>San Francisco</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <Button onClick={closeUserProfileModal}>Edit profile</Button>

                <Button
                  onClick={closeUserProfileModal}
                  variant="secondary"
                  forwardRef={cancelButtonRef}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
