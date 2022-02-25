import { useEffect } from "react";

import styles from "./scss/Gradients.module.scss";

// @debt move into ./hooks
export const useBackgroundGradient = () => {
  useEffect(() => {
    document.body.classList.add(styles.Gradients);
    return () => {
      document.body.classList.remove(styles.Gradients);
    };
  }, []);
};
