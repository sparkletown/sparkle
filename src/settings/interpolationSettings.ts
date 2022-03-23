// These constants should be used to avoid ambiguity of purpose in components such as {" "} .
// Having {" "} inside a component can be deliberate separator or accidental IDE artefact of refactoring.
// So, using {STRING_SPACE} instead of {" "}, makes it clear it was intended

export const STRING_EMPTY = "";
export const STRING_SPACE = " ";
export const STRING_DASH_SPACE = " - ";
export const STRING_DOUBLE_SLASH = "//";
export const STRING_AMPERSAND = "&";
export const STRING_PLUS = "+";
export const STRING_NEWLINE = "\n";
export const STRING_ZERO_WIDTH_SPACE = String.fromCodePoint(8203);
export const STRING_NON_BREAKING_SPACE = String.fromCodePoint(8239);
export const STRING_COPYRIGHT = "©";
