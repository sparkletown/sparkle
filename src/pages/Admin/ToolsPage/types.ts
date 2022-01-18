export type ScriptArgument = {
  title: string;
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
  // NOTE: We want this component to be trully generic
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  outputComponent: React.FC<any>;
};
