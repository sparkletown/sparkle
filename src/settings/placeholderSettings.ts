// Helper values that can be safely used in places that might re-render but don't have useMemo/useCallback

export const ALWAYS_EMPTY_OBJECT = {};
Object.freeze(ALWAYS_EMPTY_OBJECT);

export const ALWAYS_EMPTY_ARRAY = [];
Object.freeze(ALWAYS_EMPTY_ARRAY);

export const ALWAYS_NOOP_FUNCTION = () => {};
Object.freeze(ALWAYS_NOOP_FUNCTION);

export const ALWAYS_NO_STYLE_FUNCTION = () => ALWAYS_EMPTY_OBJECT;
Object.freeze(ALWAYS_NO_STYLE_FUNCTION);

export const ALWAYS_EMPTY_SELECT_OPTION = { label: "", value: "" };
Object.freeze(ALWAYS_EMPTY_SELECT_OPTION);
