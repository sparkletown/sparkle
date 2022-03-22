import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import classNames from "classnames";

import { STRING_ZERO_WIDTH_SPACE } from "settings";

import { useProfileModalControls } from "hooks/useProfileModalControls";

import { UserProfileModalBody } from "./components/UserProfileModalBody";
import * as TW from "./UserProfileModal.tailwind";

export const UserProfileModal = () => {
  const {
    selectedUserId,
    hasSelectedProfile,
    closeUserProfileModal,
  } = useProfileModalControls();

  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <Transition.Root show={hasSelectedProfile} as={Fragment}>
      <Dialog
        as="div"
        className={classNames("AdminProfileModal", TW.general)}
        initialFocus={cancelButtonRef}
        onClose={closeUserProfileModal}
      >
        <div className={TW.container}>
          <Transition.Child
            as={Fragment}
            enter={TW.enter}
            enterFrom={TW.enterFromBase}
            enterTo={TW.enterToBase}
            leave={TW.leave}
            leaveFrom={TW.enterToBase}
            leaveTo={TW.enterFromBase}
          >
            <Dialog.Overlay className={TW.overlay} />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className={TW.centering} aria-hidden="true">
            {STRING_ZERO_WIDTH_SPACE}
          </span>

          <Transition.Child
            as={Fragment}
            enter={TW.enter}
            enterFrom={classNames(TW.enterFromBase, TW.enterFromModal)}
            enterTo={classNames(TW.enterToBase, TW.enterToModal)}
            leave={TW.leave}
            leaveFrom={classNames(TW.enterToBase, TW.enterToModal)}
            leaveTo={classNames(TW.enterFromBase, TW.enterFromModal)}
          >
            <div className={TW.bodyContainer}>
              <UserProfileModalBody
                userId={selectedUserId}
                closeUserProfileModal={closeUserProfileModal}
              />
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
