import React from "react";
import { faHome } from "@fortawesome/free-solid-svg-icons";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./AdminSidebarFooter.scss";

// NOTE: Based on design, Back and Next might be completely replaced by Cancel and Save in future, but for now, allow options
export interface AdminSidebarFooterProps {
  onClickHome?: () => void;
  onClickBack?: () => void;
  onClickNext?: () => void;
  onClickCancel?: () => void;
  onClickSave?: () => void;
}

export const AdminSidebarFooter: React.FC<AdminSidebarFooterProps> = ({
  onClickHome,
  onClickBack,
  onClickNext,
  onClickCancel,
  onClickSave,
  children,
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
          >
            Next
          </ButtonNG>
        )}

        {onClickCancel && (
          <ButtonNG
            className="AdminSidebarFooter__button AdminSidebarFooter__button--smaller"
            onClick={onClickCancel}
            variant="danger"
          >
            Cancel
          </ButtonNG>
        )}
        {onClickSave && (
          <ButtonNG
            className="AdminSidebarFooter__button AdminSidebarFooter__button--larger"
            onClick={onClickSave}
            variant="primary"
          >
            Save
          </ButtonNG>
        )}
        {children}
      </div>
    </div>
  );
};
