import React, { useEffect } from "react";
import { withAuth } from "components/hocs/db/withAuth";
import { withFallback } from "components/hocs/gate/withFallback";
import { withRequired } from "components/hocs/gate/withRequired";
import { compose } from "lodash/fp";

import { useUser } from "hooks/useUser";

import { VenuePage } from "pages/VenuePage";

import { LoadingPage } from "components/molecules/LoadingPage";

import { NotLoggedInFallback } from "components/atoms/NotLoggedInFallback";

import { VideoCommsProvider } from "./VideoComms/VideoComms";
import { HuddleProvider } from "./VideoHuddle/useVideoHuddle";
import { VideoHuddle } from "./VideoHuddle/VideoHuddle";
import { AttendeeFooter } from "./AttendeeFooter";
import { ChatContainer } from "./ChatContainer";

import "scss/attendee/initial.scss";
import styles from "./AttendeeLayout.module.scss";

const _AttendeeLayout: React.FC = () => {
  const { userId } = useUser();

  useEffect(() => {
    document.documentElement.classList.add(styles.html);
    return () => {
      document.documentElement.classList.remove(styles.html);
    };
  }, []);

  if (!userId) {
    return <p>Loading</p>;
  }

  return (
    <VideoCommsProvider userId={userId}>
      <HuddleProvider>
        <header></header>
        <main>
          <section className={styles.Space}>
            <VenuePage />
          </section>
          <div className={styles.LayerUi}>
            <ChatContainer />
            {/*
          TODO VideoHuddle being available depends on the context of the space we're in.
          This probably needs more thought as to what API it provides.
        */}
            {userId && <VideoHuddle userId={userId} />}
          </div>
        </main>

        <AttendeeFooter />
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
