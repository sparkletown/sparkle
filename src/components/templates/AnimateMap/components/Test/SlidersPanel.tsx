import React, { useRef, useState } from "react";

import { GameInstance } from "../../game/GameInstance";

import "./SlidersPanel.scss";

export interface CurvesPanelProps {}

const logLight = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const str = `[${window.LIGHT_SR}, ${window.LIGHT_SG},${window.LIGHT_SB}],\n[${window.LIGHT_MR}, ${window.LIGHT_MG}, ${window.LIGHT_MB}]`;
  console.log(str);
};

export const SlidersPanel: React.FC<CurvesPanelProps> = () => {
  const [refs] = useState(new Array());
  refs[0] = useRef<HTMLInputElement>(null);
  refs[1] = useRef<HTMLInputElement>(null);
  refs[2] = useRef<HTMLInputElement>(null);
  refs[3] = useRef<HTMLInputElement>(null);
  refs[4] = useRef<HTMLInputElement>(null);
  refs[5] = useRef<HTMLInputElement>(null);
  refs[6] = useRef<HTMLInputElement>(null);
  refs[7] = useRef<HTMLInputElement>(null);
  refs[8] = useRef<HTMLInputElement>(null);
  refs[9] = useRef<HTMLInputElement>(null);
  console.log(refs);
  const keys = ["SR", "SG", "SB", "MR", "MG", "MB", "R", "G", "B", "S"];
  const colors = ["RED", "GREEN", "BLUE"];

  const childs = [];
  for (let i = 0; i < 10; i++) {
    childs.push(
      <label key={i}>
        {i !== 9 ? colors[i % 3] : "SIZE"}
        <input
          ref={refs[i]}
          type="range"
          min={i !== 9 ? 0 : 7}
          max={i !== 9 ? 1 : 800}
          defaultValue={
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            window["LIGHT_" + keys[i]]
          }
          step={0.001}
          onChange={(event) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            window["LIGHT_" + keys[i]] = Number(event.target.value);
            logLight();
          }}
        />
      </label>
    );
  }

  if (!GameInstance.instance) return <></>;

  return (
    <div className="SlidersPanel">
      <div className="column">
        SUN
        {childs.slice(0, 3)}
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
              refs[0].current.value = window.LIGHT_SR = Number(
                event.target.value
              );
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              refs[1].current.value = window.LIGHT_SG = Number(
                event.target.value
              );
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              refs[2].current.value = window.LIGHT_SB = Number(
                event.target.value
              );
              logLight();
            }}
          />
        </label>
      </div>
      <div className="column">
        MOON
        {childs.slice(3, 6)}
        <label>
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
              refs[3].current.value = window.LIGHT_MR = Number(
                event.target.value
              );
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              refs[4].current.value = window.LIGHT_MG = Number(
                event.target.value
              );
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              refs[5].current.value = window.LIGHT_MB = Number(
                event.target.value
              );
              logLight();
            }}
          />
        </label>
      </div>
      <div className="column">
        LIGHT
        {childs.slice(6)}
        <label>
          <input
            type="range"
            min={0}
            max={1}
            defaultValue={
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              window.LIGHT_R
            }
            step={0.001}
            onChange={(event) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              refs[6].current.value = window.LIGHT_R = Number(
                event.target.value
              );
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              refs[7].current.value = window.LIGHT_G = Number(
                event.target.value
              );
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              refs[8].current.value = window.LIGHT_B = Number(
                event.target.value
              );
              logLight();
            }}
          />
        </label>
      </div>
    </div>
  );
};
