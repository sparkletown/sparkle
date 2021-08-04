import { ListIteratingSystem } from "@ash.ts/ash";
import { SoundEmitterNode } from "../nodes/SoundEmitterNode";
import { Howl } from "howler";

export class SoundEmitterSystem extends ListIteratingSystem<SoundEmitterNode> {
  constructor() {
    super(SoundEmitterNode);
  }

  public updateNode(node: SoundEmitterNode, time: number): void {
    const position = node.position;
    const soundEmitter = node.soundEmitter;

    const sound = soundEmitter.sound;

    if (sound) {
      sound.pos(position.x, position.y, 0);
    }
  }

  public nodeAdded = (node: SoundEmitterNode) => {
    const position = node.position;
    const soundEmitter = node.soundEmitter;

    const sound = new Howl({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      src: soundEmitter.src,
      volume: soundEmitter.volume,
      format: ["mp3"],
      loop: soundEmitter.loop,
    });

    sound.pannerAttr({
      coneInnerAngle: 360,
      coneOuterAngle: 360,
      coneOuterGain: 0,
      maxDistance: soundEmitter.radius,
      panningModel: "HRTF",
      refDistance: 0.8,
      rolloffFactor: 2.5,
      distanceModel: "linear",
    });

    sound.pos(position.x, position.y, 0);
    sound.play();

    soundEmitter.sound = sound;
  };

  public nodeRemoved = (node: SoundEmitterNode) => {
    const soundEmitter = node.soundEmitter;
    const sound = soundEmitter.sound;

    if (sound) {
      sound.stop();
      sound.unload();

      soundEmitter.sound = null;
    }
  };
}
