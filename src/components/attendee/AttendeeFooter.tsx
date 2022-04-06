import { RefObject } from "react";

import styles from "./AttendeeFooter.module.scss";

type AttendeeFooterProps = {
  forwardRef?: RefObject<HTMLElement>;
};
export const AttendeeFooter: React.FC<AttendeeFooterProps> = ({
  forwardRef,
}) => (
  <footer className={styles.AttendeeFooter} ref={forwardRef}>
    <nav>
      <a href="#!">Contact us</a>
      <a href="#!">Terms of use</a>
      <a href="#!">Privacy policy</a>
      <a href="#!">GDPR notice</a>
      <a href="#!">Disclaimer</a>
      <a href="#!">DCMA notice</a>
      <a href="#!">Work with us</a>
    </nav>
    <p>&copy; Copyright SparkleVerse Inc & Contributors 2020 to 2022.</p>
    <p>SparkleVerse Inc is a company registered in United States of America.</p>
  </footer>
);
