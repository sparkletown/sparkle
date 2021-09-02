import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";

export interface SvgLoopProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  sources: string[];
  delay?: number;
}

const pause: (delay: number) => Promise<void> = (delay) =>
  new Promise((resolve) => setTimeout(resolve, delay));

export const SvgLoop: React.FC<SvgLoopProps> = ({
  sources,
  delay = 1000,
  alt,
  ...extraProps
}) => {
  const ref = useRef<HTMLImageElement>(null);
  const [timeout, setTimeout] = useState(delay);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    (async () => {
      let internalIndex = 0;
      while (timeout && timeout > 10) {
        await pause(timeout);
        internalIndex = (internalIndex + 1) % sources.length;
        setIndex(internalIndex);
      }
    })();
    return () => setTimeout(0);
  }, [setIndex, timeout, sources]);

  const src = sources?.[index];

  const containerClass = classNames({
    SvgLoop: true,
    [`SvgLoop--${index}`]: true,
  });

  return (
    <div className={containerClass}>
      <img
        className="SvgLoop__img"
        src={src}
        ref={ref}
        alt={alt}
        {...extraProps}
      />
    </div>
  );
};
