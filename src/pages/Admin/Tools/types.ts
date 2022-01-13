export type ScriptArgument = {
  name: string;
  isRequired: boolean;
  // NOTE: For now I would expect to only have string arguments. It can be imrpoved later on
};

export type SelfServeScript = {
  name: string;
  description: string;
  functionLocation: string;
  arguments: ScriptArgument[];
  isBeta?: boolean;
};
