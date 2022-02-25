import { STRING_SPACE } from "settings";

export type RequiredLabel = "required" | "optional" | "none";

interface InputGroupTitleProps {
  required?: RequiredLabel;
}

export const InputGroupTitle: React.FC<InputGroupTitleProps> = ({
  children,
  required = "none",
}) => (
  <h2 className="block text-sm font-medium text-gray-700">
    {children}
    {STRING_SPACE}
    {required === "required" && <span className="italic">*</span>}
    {required === "optional" && (
      <span className="italic font-normal">optional</span>
    )}
  </h2>
);
