import React from "react";
import { faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TablePanel } from "components/admin/TablePanel";

import { Channel } from "types/venues";

interface ChannelRowProps {
  channel: Channel;
  onEdit: () => void;
  onDelete: () => void;
}

export const ChannelRow: React.FC<ChannelRowProps> = ({
  channel,
  onEdit,
  onDelete,
}) => {
  return (
    <TablePanel.Row>
      <TablePanel.Cell>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">
            {channel.name}
          </div>
        </div>
      </TablePanel.Cell>
      <TablePanel.ActionsCell>
        <div
          className="flex items-center flex-row cursor-pointer"
          onClick={onEdit}
        >
          <FontAwesomeIcon
            icon={faPen}
            className="flex-shrink-0 mr-1.5 h-5 w-5 text-black"
          />
          <span className="text-black text-sm hover:text-indigo-900">Edit</span>
        </div>

        <div
          className="flex items-center flex-row cursor-pointer"
          onClick={onDelete}
        >
          <FontAwesomeIcon
            icon={faTrashCan}
            className="flex-shrink-0 mr-1.5 h-5 w-5 text-warning-red"
          />
          <span className="text-sm text-warning-red">Delete</span>
        </div>
      </TablePanel.ActionsCell>
    </TablePanel.Row>
  );
};
