import React, { useEffect, useState } from "react";
import { AttendeeFooter } from "components/attendee/AttendeeFooter";
import { ChatContainer } from "components/attendee/ChatContainer";
import { AttendeeHeader } from "components/attendee/Header/AttendeeHeader";
import { VideoCommsProvider } from "components/attendee/VideoComms/VideoCommsProvider";
import { HuddleProvider } from "components/attendee/VideoHuddle/HuddleProvider";
import { VideoHuddle } from "components/attendee/VideoHuddle/VideoHuddle";

import { SpaceWithId } from "types/id";

import { VenuePage } from "pages/VenuePage";

import "scss/attendee/initial.scss";
import styles from "./AttendeeLayout.module.scss";

export const AttendeeLayout: React.FC = () => {
  const [backButtonSpace, setBackButtonSpace] = useState<SpaceWithId>();

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
          <section className={styles.Space}>
            <VenuePage setBackButtonSpace={setBackButtonSpace} />
          </section>
          <div className={styles.LayerUi}>
            <ChatContainer />
            <VideoHuddle />
          </div>
        </main>
        <AttendeeFooter />
      </HuddleProvider>
    </VideoCommsProvider>
  );
};
