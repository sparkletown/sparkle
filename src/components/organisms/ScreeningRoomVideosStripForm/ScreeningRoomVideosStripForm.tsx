import React, { useCallback } from "react";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConfirmationModal } from "components/admin/ConfirmationModal/ConfirmationModal";

import { deleteScreeningRoomVideo } from "api/admin";

import { ScreeningRoomVideo } from "types/screeningRoom";

import { WithId } from "utils/id";

import { useShowHide } from "hooks/useShowHide";

import { ScreeningRoomVideoAddEditModal } from "components/molecules/ScreeningRoomVideoAddEditModal";

import "./ScreeningRoomVideosStripForm.scss";

interface ScreeningRoomVideosStripFormProps {
  video: WithId<ScreeningRoomVideo>;
  spaceId: string;
}

export const ScreeningRoomVideosStripForm: React.FC<ScreeningRoomVideosStripFormProps> = ({
  video,
  spaceId,
}) => {
  const { title, thumbnailSrc } = video;
  const {
    isShown: isModalShown,
    hide: hideModal,
    show: showModal,
  } = useShowHide(false);

  const {
    isShown: isConfirmationModalShown,
    hide: hideConfirmationModal,
    show: showConfirmationModal,
  } = useShowHide(false);

  const deleteVideo = useCallback(() => {
    deleteScreeningRoomVideo(video.id, spaceId);
  }, [video.id, spaceId]);

  return (
    <>
      <form className="ScreeningRoomVideosStripForm">
        <div className="ScreeningRoomVideosStripForm__cell">
          <img
            className="ScreeningRoomVideosStripForm__thumbnail-img"
            src={thumbnailSrc}
            alt={`thumbnail of ${title} video`}
          />
        </div>
        <div className="ScreeningRoomVideosStripForm__cell">{title}</div>
        <div
          className="ScreeningRoomVideosStripForm__cell ScreeningRoomVideosStripForm__edit"
          onClick={showModal}
        >
          <FontAwesomeIcon icon={faPencilAlt} /> Edit
        </div>
        <div
          className="ScreeningRoomVideosStripForm__cell ScreeningRoomVideosStripForm__delete"
          onClick={showConfirmationModal}
        >
          Delete
        </div>
      </form>

      {isModalShown && (
        <ScreeningRoomVideoAddEditModal
          video={video}
          show={true}
          onHide={hideModal}
        />
      )}

      <ConfirmationModal
        show={isConfirmationModalShown}
        header="Delete video"
        message={`Are you sure you want to delete the video '${video.title}' ?`}
        onConfirm={deleteVideo}
        onCancel={hideConfirmationModal}
        confirmVariant="danger"
      />
    </>
  );
};
