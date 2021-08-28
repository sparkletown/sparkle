const ID_TAIL_LENGTH = 6;

export const generateId: (prefix: string) => string = (prefix) =>
  `${prefix}-${Date.now()}-${Math.trunc(Math.random() * 10 ** ID_TAIL_LENGTH)}`;
