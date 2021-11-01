import React from "react";
import { faHome } from "@fortawesome/free-solid-svg-icons";

import { ButtonNG } from "components/atoms/ButtonNG";
import { ButtonProps } from "components/atoms/ButtonNG/ButtonNG";

import "./AdminSidebarFooter.scss";

// NOTE: Based on design, Back and Next might be completely replaced by Cancel and Save in future, but for now, allow options
export interface AdminSidebarFooterProps {
  // support for basic navigation
  onClickHome?: () => void;
  onClickBack?: () => void;
  onClickNext?: () => void;

  // support for a cancel button
  onClickCancel?: () => void;
  cancelButtonProps?: ButtonProps;
  cancelButtonText?: string;

  // support for a save button
  onClickSave?: () => void;
  saveButtonProps?: ButtonProps;
  saveButtonText?: string;
  disabled?: boolean;
}

export const AdminSidebarFooter: React.FC<AdminSidebarFooterProps> = ({
  onClickHome,
  onClickBack,
  onClickNext,
  onClickCancel,
  cancelButtonProps,
  cancelButtonText = "Cancel",
  onClickSave,
  saveButtonProps,
  saveButtonText = "Save",
  children,
  disabled,
}) => {
  return (
    <div className="AdminSidebarFooter AdminSidebarFooter__footer">
      <div className="AdminSidebarFooter__buttons">
        {onClickHome && (
          <ButtonNG
            className="AdminSidebarFooter__button AdminSidebarFooter__button--same-size"
            onClick={onClickHome}
            iconName={faHome}
            iconOnly={true}
            title="Home"
          />
        )}
        {onClickBack && (
          <ButtonNG
            className="AdminSidebarFooter__button"
            onClick={onClickBack}
          >
            Back
          </ButtonNG>
        )}
        {onClickNext && (
          <ButtonNG
            className="AdminSidebarFooter__button"
            onClick={onClickNext}
            variant="primary"
            disabled={disabled}
          >
            Next
          </ButtonNG>
        )}

        {(onClickCancel || cancelButtonProps) && (
          <ButtonNG
            className="AdminSidebarFooter__button AdminSidebarFooter__button--smaller"
            onClick={onClickCancel}
            variant="danger"
            {...cancelButtonProps}
          >
            {cancelButtonText}
          </ButtonNG>
        )}

        {(onClickSave || saveButtonProps) && (
          <ButtonNG
            className="AdminSidebarFooter__button AdminSidebarFooter__button--larger"
            variant="primary"
            onClick={onClickSave}
            {...saveButtonProps}
          >
            {saveButtonText}
          </ButtonNG>
        )}
        {children}
      </div>
    </div>
  );
};
