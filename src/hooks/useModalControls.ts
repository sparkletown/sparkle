import { useCallback, useState } from "react";

/**
 *
 * @returns isVisible boolean, show() function which changes isVisible to true, hide() function which changes isVisible to false
 */
export const useModalControls = () => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const showModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  const hideModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  return {
    isModalVisible,
    showModal,
    hideModal,
  };
};
