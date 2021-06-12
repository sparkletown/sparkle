import * as PIXI from "pixi.js";
import {
  CustomPIXIComponent,
  CustomPIXIComponentBehavior,
  DisplayObjectProps,
} from "react-pixi-fiber";

const TYPE = "WheelContainer";

type WheelContainerProps = DisplayObjectProps<
  PIXI.Container & { onWheel?: (event: WheelEvent) => void }
>;

interface BehaviorContext {
  applyDisplayObjectProps: (
    oldProps: WheelContainerProps,
    newProps: WheelContainerProps
  ) => void;
}

const behavior: CustomPIXIComponentBehavior<
  PIXI.Container,
  WheelContainerProps
> = {
  customDisplayObject: (props: WheelContainerProps) => new PIXI.Container(),
  customApplyProps: function (
    this: BehaviorContext,
    instance: PIXI.Container,
    oldProps: WheelContainerProps,
    newProps: WheelContainerProps
  ) {
    if (newProps.onWheel && newProps.interactive !== false) {
      console.log("RERENDER");
      instance.interactive = true; //Note: we consider the WheeContainer to be interactive unless explicitly specified "false"
      instance.off("wheel", oldProps.onWheel);
      instance.on("wheel", newProps.onWheel);
    }
    this.applyDisplayObjectProps(oldProps, newProps);
  },
};

export default CustomPIXIComponent(behavior, TYPE);
