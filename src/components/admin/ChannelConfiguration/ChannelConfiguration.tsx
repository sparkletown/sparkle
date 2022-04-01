import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAsyncFn } from "react-use";
import { HeaderButton } from "components/admin/HeaderButton";
import { Section } from "components/admin/Section";
import { SectionHeading } from "components/admin/SectionHeading";
import { SectionTitle } from "components/admin/SectionTitle";
import { TablePanel } from "components/admin/TablePanel";

import * as adminApi from "api/admin";

import { SpaceId } from "types/id";
import { Channel, MeetingRoomVenue } from "types/venues";

import { WithId } from "utils/id";

import { useShowHide } from "hooks/useShowHide";

import { ConfirmationModal } from "../ConfirmationModal/ConfirmationModal";

import { ChannelAddEditModal } from "./ChannelAddEditModal";
import { ChannelRow } from "./ChannelRow";

interface ChannelConfigurationProps {
  space: WithId<MeetingRoomVenue>;
}

export const ChannelConfiguration: React.FC<ChannelConfigurationProps> = ({
  space,
}) => {
  const {
    isShown: isShownCreateModal,
    hide: hideCreateModal,
    show: showCreateModal,
  } = useShowHide(false);

  const {
    isShown: isShownDeleteModal,
    hide: hideDeleteModal,
    show: showDeleteModal,
  } = useShowHide(false);

  const [editingIndex, setEditingIndex] = useState<number>();

  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // The cleanup below is only triggered when a deletion is complete and
    // the number of channels is reduced because we have received new data
    // The use of channels.length in the dependencies is important.
    if (isDeleting) {
      return () => {
        setIsDeleting(false);
        setEditingIndex(undefined);
      };
    }
  }, [space.channels?.length, isDeleting]);

  const saveChannel = async (channelData: Channel) => {
    await adminApi.upsertChannel(
      channelData,
      space.id as SpaceId,
      editingIndex
    );
    setEditingIndex(undefined);
  };

  const deleteChannel = useAsyncFn(async () => {
    setIsDeleting(true);
    await adminApi.deleteChannel(space.id as SpaceId, editingIndex);
    hideDeleteModal();
  }, [editingIndex, hideDeleteModal, space.id])[1];

  const channelRows = useMemo(() => {
    const channels = space.channels || [];

    return channels.map((channel, idx) => {
      if (isDeleting && idx === editingIndex) {
        // Be optimisitic about deletes and assume they succeed. Don't show
        // rows that are being deleted
        return <React.Fragment key={idx} />;
      }
      const onEdit = () => {
        setEditingIndex(idx);
        showCreateModal();
      };

      const onDelete = () => {
        setEditingIndex(idx);
        showDeleteModal();
      };

      return (
        <ChannelRow
          key={idx}
          channel={channel}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    });
  }, [
    editingIndex,
    isDeleting,
    showCreateModal,
    showDeleteModal,
    space.channels,
  ]);

  const finishEditing = useCallback(() => {
    hideCreateModal();
    setEditingIndex(undefined);
  }, [hideCreateModal]);

  const editingChannel = useMemo(() => {
    if (editingIndex === undefined) return;
    if (!space.channels) return;
    return space.channels[editingIndex];
  }, [editingIndex, space.channels]);

  return (
    <Section>
      <SectionHeading>
        <SectionTitle>Channels</SectionTitle>
        <HeaderButton onClick={showCreateModal} name="Add new channel" />
      </SectionHeading>
      <TablePanel.Panel>
        <TablePanel.Body>{channelRows}</TablePanel.Body>
      </TablePanel.Panel>
      {isShownCreateModal && (
        <ChannelAddEditModal
          show={true}
          onHide={finishEditing}
          saveChannel={saveChannel}
          channel={editingChannel}
        />
      )}
      {isShownDeleteModal && (
        <ConfirmationModal
          header="Delete channel"
          message="Are you sure you want to delete this channel?"
          onConfirm={deleteChannel}
          onCancel={hideDeleteModal}
          confirmVariant="danger"
        />
      )}
    </Section>
  );
};
