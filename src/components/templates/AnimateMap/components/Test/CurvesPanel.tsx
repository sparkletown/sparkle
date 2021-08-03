import React, { useState } from "react";
import "./CurvesPanel.scss";
import { BezierCurveEditor } from "react-bezier-curve-editor";
import { GameInstance } from "../../game/GameInstance";

export interface CurvesPanelProps {}

export const CurvesPanel: React.FC<CurvesPanelProps> = () => {
  const config = GameInstance.instance?.getConfig();
  const [inited, setInited] = useState(false);
  const points = config?.pointForBezieSpeedCurve;
  const [bezier, setBezier] = useState([0.5, 0.5, 0.5, 0.5] as [
    number,
    number,
    number,
    number
  ]);
  if (!GameInstance.instance && !config) return <></>;
  else if (!inited) {
    setBezier([points[1].x, points[1].y, points[2].x, points[2].y]);
    setInited(true);
  }

  console.log(bezier);

  return (
    <div className="CurvesPanel">
      <div className="column">
        <div className="space"></div>
        <div className="row">
          <label>min</label>
          <input
            type="number"
            name="tentacles"
            min="1"
            max="100"
            defaultValue={config.minSpeed.toString()}
            onChange={(e) => {
              if (config) config.minSpeed = Number(e.target.value);
            }}
          />
        </div>
      </div>
      <BezierCurveEditor
        size={50}
        outerAreaSize={100}
        value={bezier}
        onChange={(c) => {
          config.pointForBezieSpeedCurve = [
            { x: 0, y: 0 },
            { x: c[0], y: c[1] },
            {
              x: c[2],
              y: c[3],
            },
            { x: 1, y: 1 },
          ];
          setBezier([c[0], c[1], c[2], c[3]]);
        }}
      />
      <div className="column">
        <div className="row">
          <label>max</label>
          <input
            type="number"
            name="tentacles"
            min="1"
            max="100"
            defaultValue={config.maxSpeed.toString()}
            onChange={(e) => {
              if (config) config.maxSpeed = Number(e.target.value);
            }}
          />
        </div>
        <div className="space"></div>
      </div>
    </div>
  );
};
