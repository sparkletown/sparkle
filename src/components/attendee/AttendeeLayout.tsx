import { useEffect } from "react";

import { RelatedVenuesProvider } from "hooks/useRelatedVenues";

import { VenuePage } from "pages/VenuePage";

import { AttendeeFooter } from "./AttendeeFooter";
import { ChatContainer } from "./ChatContainer";

import styles from "./AttendeeLayout.module.scss";


export const AttendeeLayout: React.FC = () => {
  useEffect(() => {
    document.documentElement.classList.add(styles.html);
    return () => {
      document.documentElement.classList.remove(styles.html);
    };
  }, []);

  return (
    <>
      <header></header>
      <main>
        <section className={styles.Space}>
          <VenuePage />
        </section>
        <div className={styles.LayerUi}>
          <ChatContainer />
        </div>
      </main>

      <AttendeeFooter />
    </>
  );
}
