import React, { useEffect, useRef, useState } from "react";
import { useIntersection } from "react-use";
import classNames from "classnames";
import { AttendeeFooter } from "components/attendee/AttendeeFooter";
import { AttendeeHeader } from "components/attendee/AttendeeHeader";
import { ChatContainer } from "components/attendee/ChatContainer";
import { withSlugs } from "components/hocs/context/withSlugs";
import { withAuth } from "components/hocs/db/withAuth";
import { withSpacesBySlug } from "components/hocs/db/withSpacesBySlug";
import { withFallback } from "components/hocs/gate/withFallback";
import { withRequired } from "components/hocs/gate/withRequired";
import { compose } from "lodash/fp";

import { ATTENDEE_LAYOUT_CLASSNAME, POPOVER_CONTAINER_ID } from "settings";

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

const _AttendeeLayout: React.FC<_AttendeeLayoutProps> = ({ space }) => {
  const [backButtonSpace, setBackButtonSpace] = useState<SpaceWithId>();
  const footerRef = useRef<HTMLElement>(null);
  const footerIntersect = useIntersection(footerRef, {
    rootMargin: "0px",
  });

  const {
    isShown: isBlurTurnedOn,
    show: turnOnBlur,
    hide: turnOffBlur,
  } = useShowHide();

  const isChatRelative = footerIntersect?.isIntersecting;
  const layerUIClasses = classNames(styles.LayerUi, {
    [styles.LayerUiRelative]: isChatRelative,
    [styles.blur]: isBlurTurnedOn,
  });

  const banner = space?.banner;

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
          <section
            className={`${styles.Space} ${
              isBlurTurnedOn && banner && styles.blur
            }`}
          >
            <VenuePage setBackButtonSpace={setBackButtonSpace} />
          </section>
          <div className={layerUIClasses}>
            <ChatContainer isRelative={isChatRelative} />
            <VideoHuddle />
          </div>
        </main>

        <AttendeeFooter forwardRef={footerRef} />
        {/* Used by popovers to ensure z-index is handled properly */}
        <div id={POPOVER_CONTAINER_ID} className={styles.popoverContainer} />
        {banner && (
          <Banner
            banner={banner}
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
  withSpacesBySlug,
  withRequired({
    required: ["userId"],
    fallback: LoadingPage,
  })
)(_AttendeeLayout);
