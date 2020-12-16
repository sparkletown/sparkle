type ScriptProps = "src" | "id";
type LoadScriptProps = Record<ScriptProps, string>;

export const loadScript = (options: LoadScriptProps) => {
  const script = document.createElement("script");

  Object.entries(options).forEach(([propertyName, property]) => {
    script[propertyName as ScriptProps] = property;
  });

  document.querySelector("body")?.appendChild(script);
};
