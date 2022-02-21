import React, { useCallback, useEffect, useState } from "react";

type ComponentDimensions = {
  width: number;
  height: number;
};

type UseComponentDimenstionsOptions = {
  componentRef: React.MutableRefObject<HTMLElement | null>;
};

export const useComponentDismensions = (
  options: UseComponentDimenstionsOptions
) => {
  const { componentRef } = options;

  const [dimensions, setDimensions] = useState<ComponentDimensions>({
    width: 0,
    height: 0,
  });

  const updateDimensions = useCallback(() => {
    setDimensions({
      width: componentRef.current?.clientWidth ?? 0,
      height: componentRef.current?.clientHeight ?? 0,
    });
  }, [componentRef]);

  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [updateDimensions]);

  return dimensions;
};
