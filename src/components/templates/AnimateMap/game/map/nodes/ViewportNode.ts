import { defineNode } from "@ash.ts/ash";
import { ViewportComponent } from "../components/ViewportComponent";

export class ViewportNode extends defineNode({
  viewport: ViewportComponent,
}) {}
