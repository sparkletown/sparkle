import React, { useEffect } from "react";

import { useUser } from "hooks/useUser";

import { VenuePage } from "pages/VenuePage";

import { VideoCommsProvider } from "./VideoComms/VideoComms";
import { VideoHuddle } from "./VideoHuddle/VideoHuddle";
import { AttendeeFooter } from "./AttendeeFooter";
import { ChatContainer } from "./ChatContainer";

import styles from "./AttendeeLayout.module.scss";

export const AttendeeLayout: React.FC = () => {
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
    </VideoCommsProvider>
  );
};
