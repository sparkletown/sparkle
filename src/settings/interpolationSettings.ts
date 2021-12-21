// These constants should be used to avoid ambiguity of purpose in components such as {" "} .
// Having {" "} inside a component can be deliberate separator or accidental IDE artefact of refactoring.
// So, using {STRING_SPACE} instead of {" "}, makes it clear it was intended

export const STRING_EMPTY = "";
export const STRING_SPACE = " ";
export const STRING_DOUBLE_SLASH = "//";
export const STRING_AMPERSAND = "&";
