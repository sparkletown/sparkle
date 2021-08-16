export interface ReduxAction<T, P extends Record<string, unknown>> {
  type: T;
  payload: P;
}
