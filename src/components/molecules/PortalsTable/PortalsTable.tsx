import React from "react";
import { HeaderButton } from "components/admin/HeaderButton";
import { PortalStripForm } from "components/admin/PortalStripForm";
import { Section } from "components/admin/Section";
import { SectionHeading } from "components/admin/SectionHeading";
import { SectionTitle } from "components/admin/SectionTitle";
import { TablePanel } from "components/admin/TablePanel";

import { ALWAYS_EMPTY_ARRAY } from "settings";

import { SpaceWithId } from "types/id";
import { isVenueWithRooms } from "types/venues";

import { useShowHide } from "hooks/useShowHide";

import { PortalAddEditModal } from "../PortalAddEditModal";

interface PortalsTableProps {
  space: SpaceWithId;
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
    <Section>
      <SectionHeading>
        <SectionTitle>Portals</SectionTitle>
        <HeaderButton onClick={showCreateModal} name="Create portal" />
      </SectionHeading>
      <TablePanel.Panel>
        <TablePanel.Body>
          {portals?.map((portal, index) => (
            <PortalStripForm
              key={`${portal.title}-${index}`}
              portal={portal}
              index={index}
              spaceId={space?.id}
            />
          ))}
          {isShownCreateModal && (
            <PortalAddEditModal show={true} onHide={hideCreateModal} />
          )}
        </TablePanel.Body>
      </TablePanel.Panel>
    </Section>
  );
};
