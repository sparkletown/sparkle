import React from "react";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useShowHide } from "hooks/useShowHide";

import { ButtonNG } from "components/atoms/ButtonNG";
import { ScreeningRoomVideoAddEditModal } from "components/molecules/ScreeningRoomVideoAddEditModal";
import { ScreeningRoomVideosStripForm } from "components/organisms/ScreeningRoomVideosStripForm";
import { useScreeningRoomVideos } from "components/templates/ScreeningRoom/useScreeningRoom";

import { Loading } from "../Loading";

import "./ScreeningRoomVideosTable.scss";

export interface ScreeningRoomVideosTableProps {
  space: WithId<AnyVenue>;
}

export const ScreeningRoomVideosTable: React.FC<ScreeningRoomVideosTableProps> = ({
  space,
}) => {
  const {
    isShown: isShownCreateModal,
    hide: hideCreateModal,
    show: showCreateModal,
  } = useShowHide(false);

  const {
    screeningRoomVideos,
    isScreeningRoomVideosLoaded: isVideosLoaded,
  } = useScreeningRoomVideos(space.id);

  return (
    <div className="ScreeningRoomVideosTable">
      <div className="ScreeningRoomVideosTable__header">
        <span className="ScreeningRoomVideosTable__title">Videos</span>
        <ButtonNG onClick={showCreateModal}>Add new video</ButtonNG>
      </div>

      <div className="ScreeningRoomVideosTable__table">
        {screeningRoomVideos?.map((video, index) => (
          <ScreeningRoomVideosStripForm
            key={index}
            video={video}
            spaceId={space?.id}
          />
        ))}
        {isShownCreateModal && (
          <ScreeningRoomVideoAddEditModal
            show={true}
            onHide={hideCreateModal}
          />
        )}
      </div>

      {!isVideosLoaded && <Loading label="Loading videos..." />}
    </div>
  );
};
