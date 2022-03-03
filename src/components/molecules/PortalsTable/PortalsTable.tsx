import React from "react";
import { PortalStripForm } from "components/admin/PortalStripForm";

import { ALWAYS_EMPTY_ARRAY } from "settings";

import { AnyVenue, isVenueWithRooms } from "types/venues";

import { WithId } from "utils/id";

import { useShowHide } from "hooks/useShowHide";

import { ButtonNG } from "components/atoms/ButtonNG";

import { PortalAddEditModal } from "../PortalAddEditModal";

import "./PortalsTable.scss";

interface PortalsTableProps {
  space: WithId<AnyVenue>;
}

export const PortalsTable: React.FC<PortalsTableProps> = ({ space }) => {
  const isSupportingPortals = isVenueWithRooms(space);
  const portals = isSupportingPortals ? space?.rooms : ALWAYS_EMPTY_ARRAY;

  const {
    isShown: isShownCreateModal,
    hide: hideCreateModal,
    show: showCreateModal,
  } = useShowHide(false);

  return (
    <>
      <ButtonNG onClick={showCreateModal}>Create portal</ButtonNG>
      <div className="PortalsTable">
        {portals?.map((portal, index) => (
          <PortalStripForm
            key={index}
            portal={portal}
            index={index}
            spaceId={space?.id}
          />
        ))}
        {isShownCreateModal && (
          <PortalAddEditModal show={true} onHide={hideCreateModal} />
        )}
      </div>
    </>
  );
};
