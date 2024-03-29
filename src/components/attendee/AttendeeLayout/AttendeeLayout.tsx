import React, { useEffect, useRef, useState } from "react";
import { useIntersection } from "react-use";
import classNames from "classnames";
import { AttendeeFooter } from "components/attendee/AttendeeFooter";
import { AttendeeHeader } from "components/attendee/AttendeeHeader";
import { Banner } from "components/attendee/Banner/Banner";
import { ChatContainer } from "components/attendee/ChatContainer";
import { MainSection } from "components/attendee/MainSection";
import { VideoCommsProvider } from "components/attendee/VideoComms/VideoCommsProvider";
import { HuddleProvider } from "components/attendee/VideoHuddle/HuddleProvider";
import { VideoHuddle } from "components/attendee/VideoHuddle/VideoHuddle";

import { ATTENDEE_LAYOUT_CLASSNAME, POPOVER_CONTAINER_ID } from "settings";

import { SpaceWithId } from "types/id";

import { isTruthy } from "utils/types";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useShowHide } from "hooks/useShowHide";

import { VenuePage } from "pages/VenuePage";

import { NotFound } from "../errors/NotFound";

import "scss/attendee/initial.scss";
import styles from "./AttendeeLayout.module.scss";

export const AttendeeLayout = () => {
  const { space, isLoaded } = useWorldAndSpaceByParams();
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

  const isFooterRendered = footerIntersect?.isIntersecting;
  const layerUIClasses = classNames(styles.LayerUi, {
    [styles.relative]: isFooterRendered,
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

  // Loading status is handled inside here rather than in a HOC so that the
  // UI layer can be rendered and maintained across route transitions. This
  // reduces the amount of re-rendering.
  if (isLoaded && !space) {
    return <NotFound />;
  }

  return (
    <VideoCommsProvider>
      <HuddleProvider>
        <AttendeeHeader
          backButtonSpace={backButtonSpace}
          isBannerOn={isBlurTurnedOn}
        />
        <main data-bem="AttendeeLayout__main">
          <MainSection isBlurred={isTruthy(isBlurTurnedOn && banner)}>
            <VenuePage setBackButtonSpace={setBackButtonSpace} />
          </MainSection>
          <div className={layerUIClasses}>
            <ChatContainer isRelative={isFooterRendered} />
            <VideoHuddle isFixed={isFooterRendered} />
          </div>
        </main>

        <AttendeeFooter forwardRef={footerRef} />
        {/* Used by popovers to ensure z-index is handled properly */}
        <div
          data-bem="AttendeeLayout__popover"
          id={POPOVER_CONTAINER_ID}
          className={styles.popoverContainer}
        />
        {isLoaded && space?.id && (
          <Banner
            spaceId={space.id}
            turnOnBlur={turnOnBlur}
            turnOffBlur={turnOffBlur}
          />
        )}
      </HuddleProvider>
    </VideoCommsProvider>
  );
};
