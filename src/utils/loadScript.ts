import { HTMLAttributes } from "react";

export function loadScript(
  src: string,
  onLoad: () => void,
  options?: HTMLAttributes<HTMLScriptElement>
) {
  const script = document.createElement("script");
  script.src = src;

  if (options?.id) {
    script.id = options.id;
  }

  script.onload = onLoad;
  document.querySelector("body")?.appendChild(script);
}
