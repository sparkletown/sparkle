type GenerateClassNameGetter = (
  classes: Record<string, string>
) => (name: string) => string;

export const generateClassNameGetter: GenerateClassNameGetter = (classes) => {
  console.log(JSON.stringify(classes, null, 2));
  return (name) => {
    const generatedName = classes[name] ?? "";
    return name ? `${name} ${generatedName}`.trim() : "";
  };
};
