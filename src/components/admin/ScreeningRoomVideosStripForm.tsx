import React, { useCallback } from "react";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConfirmationModal } from "components/admin/ConfirmationModal/ConfirmationModal";
import { TablePanel } from "components/admin/TablePanel";

import { deleteScreeningRoomVideo } from "api/admin";

import { ScreeningRoomVideo } from "types/screeningRoom";

import { WithId } from "utils/id";

import { useShowHide } from "hooks/useShowHide";

import { ScreeningRoomVideoAddEditModal } from "./ScreeningRoomVideoAddEditModal";

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
      <TablePanel.Row>
        <TablePanel.Cell>
          <div className="flex-shrink-0 w-10">
            <img
              className="max-h-10 max-w-10 rounded-md"
              src={thumbnailSrc}
              alt={`thumbnail of ${title} video`}
            />
          </div>
        </TablePanel.Cell>

        <TablePanel.Cell>{title}</TablePanel.Cell>

        <TablePanel.ActionsCell>
          <div onClick={showModal}>
            <FontAwesomeIcon icon={faPencilAlt} /> Edit
          </div>

          <div onClick={showConfirmationModal}>Delete</div>
        </TablePanel.ActionsCell>

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
      </TablePanel.Row>
    </>
  );
};
