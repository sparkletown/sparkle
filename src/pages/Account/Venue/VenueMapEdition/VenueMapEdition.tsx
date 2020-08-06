import React, { useState, useCallback } from "react";
import { Container } from "./Container";
import { CustomDragLayer } from "./CustomDragLayer";

export const Example: React.FC = () => {
  const [snapToGridAfterDrop, setSnapToGridAfterDrop] = useState(false);
  const [snapToGridWhileDragging, setSnapToGridWhileDragging] = useState(false);

  const handleSnapToGridAfterDropChange = useCallback(() => {
    setSnapToGridAfterDrop(!snapToGridAfterDrop);
  }, [snapToGridAfterDrop]);

  const handleSnapToGridWhileDraggingChange = useCallback(() => {
    setSnapToGridWhileDragging(!snapToGridWhileDragging);
  }, [snapToGridWhileDragging]);

  return (
    <div>
      <Container snapToGrid={snapToGridAfterDrop} />
      <CustomDragLayer snapToGrid={snapToGridWhileDragging} />
    </div>
  );
};

export default Example;
