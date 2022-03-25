import React, { useEffect, useState } from "react";
import { AttendeeFooter } from "components/attendee/AttendeeFooter";
import { AttendeeHeader } from "components/attendee/AttendeeHeader";
import { ChatContainer } from "components/attendee/ChatContainer";
import { withSlugs } from "components/hocs/context/withSlugs";
import { withAuth } from "components/hocs/db/withAuth";
import { withWorldAndSpace } from "components/hocs/db/withWorldAndSpace";
import { withFallback } from "components/hocs/gate/withFallback";
import { withRequired } from "components/hocs/gate/withRequired";
import { compose } from "lodash/fp";

import { POPOVER_CONTAINER_ID } from "settings";

import { SpaceWithId } from "types/id";

import { useShowHide } from "hooks/useShowHide";

import { VenuePage } from "pages/VenuePage";

import { LoadingPage } from "components/molecules/LoadingPage";

import { NotLoggedInFallback } from "components/atoms/NotLoggedInFallback";

import { Banner } from "./Banner/Banner";
import { VideoCommsProvider } from "./VideoComms/VideoCommsProvider";
import { HuddleProvider } from "./VideoHuddle/HuddleProvider";
import { VideoHuddle } from "./VideoHuddle/VideoHuddle";

import "scss/attendee/initial.scss";
import styles from "./AttendeeLayout.module.scss";

interface _AttendeeLayoutProps {
  userId: string;
  space: SpaceWithId;
}

const _AttendeeLayout: React.FC<_AttendeeLayoutProps> = ({ userId, space }) => {
  const [backButtonSpace, setBackButtonSpace] = useState<SpaceWithId>();
  const {
    isShown: isBlurTurnedOn,
    show: turnOnBlur,
    hide: turnOffBlur,
  } = useShowHide();

  useEffect(() => {
    document.documentElement.classList.add(styles.html);
    return () => {
      document.documentElement.classList.remove(styles.html);
    };
  }, []);

  return (
    <VideoCommsProvider>
      <HuddleProvider>
        <AttendeeHeader backButtonSpace={backButtonSpace} />
        <main>
          <section
            className={`${styles.Space} ${isBlurTurnedOn && styles.blur}`}
          >
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
        {space.banner && (
          <Banner
            banner={space.banner}
            turnOnBlur={turnOnBlur}
            turnOffBlur={turnOffBlur}
          />
        )}
      </HuddleProvider>
    </VideoCommsProvider>
  );
};

export const AttendeeLayout = compose(
  withAuth,
  withFallback(["isAuthLoaded", "userId"], NotLoggedInFallback),
  withSlugs,
  withWorldAndSpace,
  withRequired({
    required: ["userId"],
    fallback: LoadingPage,
  })
)(_AttendeeLayout);
