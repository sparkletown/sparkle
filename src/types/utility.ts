export type ExtractProps<T> = T extends React.FunctionComponent<infer U>
  ? U
  : never;
