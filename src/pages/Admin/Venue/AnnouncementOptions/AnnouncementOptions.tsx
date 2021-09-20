import React from "react";

import { Banner } from "types/banner";

import { AnnouncementStatus } from "pages/Admin/Venue/AnnouncementStatus";

import { ButtonNG } from "components/atoms/ButtonNG";

import "./AnnouncementOptions.scss";

export interface AnnouncementOptionsProps {
  banner?: Banner;
  onEdit: () => void;
}

export const AnnouncementOptions: React.FC<AnnouncementOptionsProps> = ({
  banner,
  onEdit,
}) => {
  return (
    <div className="AnnouncementOptions">
      <div className="AnnouncementOptions__left-side">
        <AnnouncementStatus banner={banner} />
      </div>
      <div className="AnnouncementOptions__right-side">
        <ButtonNG onClick={onEdit} className="AnnouncementOptions__edit-button">
          Edit
        </ButtonNG>
      </div>
    </div>
  );
};
