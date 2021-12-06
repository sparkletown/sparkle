import React, { useCallback, useState } from "react";

import { ALWAYS_EMPTY_ARRAY } from "settings";

import { AnyVenue, isVenueWithRooms } from "types/venues";

import { WithId } from "utils/id";

import { PortalStripForm } from "components/organisms/PortalStripForm";

import { ButtonNG } from "components/atoms/ButtonNG";

import { PortalAddEditModal } from "../PortalAddEditModal";

import "./PortalsTable.scss";

export interface PortalsTableProps {
  space: WithId<AnyVenue>;
}

export const PortalsTable: React.FC<PortalsTableProps> = ({ space }) => {
  const isSupportingPortals = isVenueWithRooms(space);
  const portals = isSupportingPortals ? space?.rooms : ALWAYS_EMPTY_ARRAY;
  const [showCreateModal, setShowCreateModal] = useState(false);

  const openModal = useCallback(() => {
    setShowCreateModal(true);
  }, [setShowCreateModal]);

  const hideModal = useCallback(() => {
    setShowCreateModal(false);
  }, [setShowCreateModal]);

  return (
    <>
      <ButtonNG onClick={openModal}>Create portal</ButtonNG>
      <div className="PortalsTable">
        {portals?.map((portal, index) => (
          <PortalStripForm
            key={index}
            portal={portal}
            index={index}
            spaceId={space?.id}
          />
        ))}
        {showCreateModal && (
          <PortalAddEditModal show={true} onHide={hideModal} />
        )}
      </div>
    </>
  );
};
