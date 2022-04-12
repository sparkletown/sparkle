import React from "react";
import { HeaderButton } from "components/admin/HeaderButton";
import { Section } from "components/admin/Section";
import { SectionHeading } from "components/admin/SectionHeading";
import { SectionTitle } from "components/admin/SectionTitle";
import { TablePanel } from "components/admin/TablePanel";

import { SpaceWithId } from "types/id";

import { useShowHide } from "hooks/useShowHide";

import { useScreeningRoomVideos } from "components/templates/ScreeningRoom/useScreeningRoom";

import { Loading } from "components/molecules/Loading";

import { ScreeningRoomVideoAddEditModal } from "./ScreeningRoomVideoAddEditModal";
import { ScreeningRoomVideosStripForm } from "./ScreeningRoomVideosStripForm";

export interface ScreeningRoomVideosTableProps {
  space: SpaceWithId;
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
    <div data-bem="ScreeningRoomVideosTable">
      <Section>
        <SectionHeading>
          <SectionTitle>Videos</SectionTitle>
          <HeaderButton onClick={showCreateModal} name="Add new video" />
        </SectionHeading>

        <TablePanel.Panel>
          <TablePanel.Body>
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
          </TablePanel.Body>
        </TablePanel.Panel>

        {!isVideosLoaded && <Loading label="Loading videos..." />}
      </Section>
    </div>
  );
};
