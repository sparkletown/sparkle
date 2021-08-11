import { subscribeActionAfter } from "redux-subscribe-action";

import {
  AnimateMapActionTypes,
  setAnimateMapPointerAction,
} from "store/actions/AnimateMap";

import { Point } from "../utils/Point";

import Command from "./Command";

export default class WaitClickForHeroCreation implements Command {
  private resolve: Function | null = null;
  public clickPoint: Point | null = null;

  private _unsubscribeSetPointer!: () => void;

  public execute(): Promise<Command> {
    this._unsubscribeSetPointer = subscribeActionAfter(
      AnimateMapActionTypes.SET_POINTER,
      (action) =>
        this._onSetPointer(
          (action as setAnimateMapPointerAction).payload.pointer
        )
    );

    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  private complete(): void {
    if (this.resolve) {
      this._unsubscribeSetPointer();

      this.resolve(this);
      this.resolve = null;
    }
  }

  private _onSetPointer(point: Point): void {
    // TODO add conditions
    this.clickPoint = point;
    this.complete();
  }
}
