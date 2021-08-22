import React, { useRef } from "react";

import { GameInstance } from "../../game/GameInstance";

import "./SlidersPanel.scss";

export interface CurvesPanelProps {}

const logLight = () => {
  console.log({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    sun: [window.LIGHT_SR, window.LIGHT_SG, window.LIGHT_SB],
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    moon: [window.LIGHT_MR, window.LIGHT_MG, window.LIGHT_MB],
  });
};

export const SlidersPanel: React.FC<CurvesPanelProps> = () => {
  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);
  const ref3 = useRef<HTMLInputElement>(null);

  if (!GameInstance.instance) return <></>;

  return (
    <div className="SlidersPanel">
      <div className="column">
        SUN
        <label>
          RED
          <input
            ref={ref1}
            type="range"
            min={0}
            max={1}
            defaultValue={
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              window.LIGHT_SR
            }
            step={0.001}
            onChange={(event) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              window.LIGHT_SR = event.target.value;
              logLight();
            }}
          />
        </label>
        <label>
          GREEN
          <input
            ref={ref2}
            type="range"
            min={0}
            max={1}
            defaultValue={
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              window.LIGHT_SG
            }
            step={0.001}
            onChange={(event) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              window.LIGHT_SG = event.target.value;
              logLight();
            }}
          />
        </label>
        <label>
          BLUE
          <input
            ref={ref3}
            type="range"
            min={0}
            max={1}
            defaultValue={
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              window.LIGHT_SB
            }
            step={0.001}
            onChange={(event) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              window.LIGHT_SB = event.target.value;
              logLight();
            }}
          />
        </label>
        <label>
          <input
            type="range"
            min={0}
            max={1}
            defaultValue={
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              window.LIGHT_SB
            }
            step={0.001}
            onChange={(event) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              ref1.current.value = window.LIGHT_SR = event.target.value;
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              ref2.current.value = window.LIGHT_SG = event.target.value;
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              ref3.current.value = window.LIGHT_SB = event.target.value;
              logLight();
            }}
          />
        </label>
      </div>
      <div className="column">
        MOON
        <label>
          RED
          <input
            type="range"
            min={0}
            max={1}
            defaultValue={
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              window.LIGHT_MR
            }
            step={0.001}
            onChange={(event) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              window.LIGHT_MR = event.target.value;
              logLight();
            }}
          />
        </label>
        <label>
          GREEN
          <input
            type="range"
            min={0}
            max={1}
            defaultValue={
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              window.LIGHT_MG
            }
            step={0.001}
            onChange={(event) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              window.LIGHT_MG = event.target.value;
              logLight();
            }}
          />
        </label>
        <label>
          BLUE
          <input
            type="range"
            min={0}
            max={1}
            defaultValue={
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              window.LIGHT_MB
            }
            step={0.001}
            onChange={(event) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              window.LIGHT_MB = event.target.value;
              logLight();
            }}
          />
        </label>
      </div>
    </div>
  );
};
