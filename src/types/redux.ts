export interface ReduxAction<T, P extends {}> {
  type: T;
  payload: P;
}
