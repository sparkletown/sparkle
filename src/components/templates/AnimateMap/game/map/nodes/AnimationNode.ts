import { defineNode } from "@ash.ts/ash";
import { AnimationComponent } from "../components/AnimationComponent";

export class AnimationNode extends defineNode({
  animation: AnimationComponent,
}) {}
