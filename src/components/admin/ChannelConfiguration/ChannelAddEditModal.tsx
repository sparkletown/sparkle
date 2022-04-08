import React from "react";

import { Channel } from "types/venues";

import { Modal } from "components/molecules/Modal";

import { ChannelAddEditForm } from "./ChannelAddEditForm";

type ChannelAddEditModalProps = {
  show: boolean;
  onHide: () => void;
  channel?: Channel;
  saveChannel: (channelData: Channel) => Promise<void>;
};

export const ChannelAddEditModal: React.FC<ChannelAddEditModalProps> = ({
  onHide,
  show,
  channel,
  saveChannel,
}) => {
  return (
    <Modal show={show} onHide={onHide} autoHide>
      <ChannelAddEditForm
        onDone={onHide}
        channel={channel}
        saveChannel={saveChannel}
      />
    </Modal>
  );
};
