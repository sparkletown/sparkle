import React, { useEffect, useState } from "react";
import { AttendeeFooter } from "components/attendee/AttendeeFooter";
import { AttendeeHeader } from "components/attendee/AttendeeHeader";
import { ChatContainer } from "components/attendee/ChatContainer";
import { withAuth } from "components/hocs/db/withAuth";
import { withFallback } from "components/hocs/gate/withFallback";
import { withRequired } from "components/hocs/gate/withRequired";
import { compose } from "lodash/fp";

import { ATTENDEE_LAYOUT_CLASSNAME, POPOVER_CONTAINER_ID } from "settings";

import { SpaceWithId } from "types/id";

import { VenuePage } from "pages/VenuePage";

import { LoadingPage } from "components/molecules/LoadingPage";

import { NotLoggedInFallback } from "components/atoms/NotLoggedInFallback";

import { VideoCommsProvider } from "./VideoComms/VideoCommsProvider";
import { HuddleProvider } from "./VideoHuddle/HuddleProvider";
import { VideoHuddle } from "./VideoHuddle/VideoHuddle";

import "scss/attendee/initial.scss";
import styles from "./AttendeeLayout.module.scss";

interface _AttendeeLayoutProps {
  userId: string;
}

const _AttendeeLayout: React.FC<_AttendeeLayoutProps> = ({ userId }) => {
  const [backButtonSpace, setBackButtonSpace] = useState<SpaceWithId>();

  useEffect(() => {
    document.documentElement.classList.add(
      ATTENDEE_LAYOUT_CLASSNAME,
      styles.html
    );
    return () => {
      document.documentElement.classList.remove(
        ATTENDEE_LAYOUT_CLASSNAME,
        styles.html
      );
    };
  }, []);

  return (
    <VideoCommsProvider>
      <HuddleProvider>
        <AttendeeHeader backButtonSpace={backButtonSpace} />
        <main>
          <section className={styles.Space}>
            <VenuePage setBackButtonSpace={setBackButtonSpace} />
          </section>
          <div className={styles.LayerUi}>
            <ChatContainer />
            <VideoHuddle />
          </div>
        </main>

        <AttendeeFooter />
        {/* Used by popovers to ensure z-index is handled properly */}
        <div id={POPOVER_CONTAINER_ID} className={styles.popoverContainer} />
      </HuddleProvider>
    </VideoCommsProvider>
  );
};

export const AttendeeLayout = compose(
  withAuth,
  withFallback(["isAuthLoaded", "userId"], NotLoggedInFallback),
  withRequired({
    required: ["userId"],
    fallback: LoadingPage,
  })
)(_AttendeeLayout);
