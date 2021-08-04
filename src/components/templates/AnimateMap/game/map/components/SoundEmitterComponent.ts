import { Howl } from "howler";

export class SoundEmitterComponent {
  constructor(
    public radius: number,
    public src: string | undefined = undefined,
    public sound: Howl | null = null,
    public volume: number = 1,
    public loop: boolean = true
  ) {}
}
