type ScriptProps = "src" | "id" | "onload";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LoadScriptProps = Record<ScriptProps, any>;

export const loadScript = (options: LoadScriptProps) => {
  const script = document.createElement("script");

  Object.entries(options).forEach(([propertyName, property]) => {
    script[propertyName as ScriptProps] = property;
  });

  document.querySelector("body")?.appendChild(script);
};
