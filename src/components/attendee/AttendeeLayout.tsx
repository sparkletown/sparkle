import { useEffect } from "react";

import { useUser } from "hooks/useUser";

import { VenuePage } from "pages/VenuePage";

import { AttendeeHeader } from "./Header/AttendeeHeader";
import { VideoHuddleProvider } from "./VideoHuddle/VideoHuddle";
import { AttendeeFooter } from "./AttendeeFooter";
import { ChatContainer } from "./ChatContainer";
import { VideoHuddle } from "./VideoHuddle";

import styles from "./AttendeeLayout.module.scss";

export const AttendeeLayout: React.FC = () => {
  const { userId } = useUser();

  useEffect(() => {
    document.documentElement.classList.add(styles.html);
    return () => {
      document.documentElement.classList.remove(styles.html);
    };
  }, []);

  return (
    <VideoHuddleProvider>
      <AttendeeHeader />
      <main>
        <section className={styles.Space}>
          <VenuePage />
        </section>
        <div className={styles.LayerUi}>
          <ChatContainer />
          {userId && <VideoHuddle userId={userId} />}
        </div>
      </main>

      <AttendeeFooter />
    </VideoHuddleProvider>
  );
};
