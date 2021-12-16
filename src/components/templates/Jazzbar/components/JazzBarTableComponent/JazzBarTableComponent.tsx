import React from "react";
import { Modal } from "react-bootstrap";
import { useAsyncFn } from "react-use";

import { DEFAULT_PARTY_NAME, DEFAULT_PROFILE_IMAGE } from "settings";

import { deleteTable, updateVenueTable } from "api/table";

import { TableComponentPropsType } from "types/Table";

import { useIsAdminUser } from "hooks/roles";
import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";

import { JAZZBAR_TABLES } from "components/templates/Jazzbar/JazzBar/constants";

import { ButtonNG } from "components/atoms/ButtonNG";

import PortalCloseIcon from "assets/icons/icon-close-portal.svg";

import "./JazzBarTableComponent.scss";

// @debt THIS COMPONENT IS THE COPY OF components/molecules/TableComponent
// The reason to copy it was the lack of time to refactor the whole thing, so the
// safest approch (not to break other Venues that rely on TableComponent) is to copy this component
// It needs to get deleted in the future
export const JazzBarTableComponent: React.FunctionComponent<TableComponentPropsType> = ({
  users,
  onJoinClicked,
  imageSize = 50,
  table,
  tableLocked,
  venue,
}) => {
  const { openUserProfileModal } = useProfileModalControls();
  const locked = tableLocked(table.reference);

  const numberOfSeatsLeft = table.capacity && table.capacity - users.length;
  const full = numberOfSeatsLeft === 0;

  const { userId } = useUser();

  const { isAdminUser, isLoading: isCheckingRole } = useIsAdminUser(userId);

  const isRemoveButtonShown = !isCheckingRole && isAdminUser;

  const {
    isShown: isModalShown,
    toggle: toggleModal,
    hide: hideModal,
  } = useShowHide(false);

  const [{ loading: isDeletingTable }, removeTable] = useAsyncFn(async () => {
    if (!venue.id) return;

    await deleteTable({
      venueId: venue.id,
      tableName: table.reference,
    });
  }, [table.reference, venue.id]);

  const [{ loading: isUpdatingTables }, updateTables] = useAsyncFn(async () => {
    if (!venue.id) return;

    await updateVenueTable({
      venueId: venue.id,
      defaultTables: JAZZBAR_TABLES,
    });
  }, [venue.id]);

  const handleTableDelete = async () => {
    // there are venues that don't have tables inserted in the database and use default ones instead
    // if that's the case, then we won't be able to delete any of the tables
    // thus we have to create tables before modifying them
    if (!venue.config?.tables) {
      await updateTables();
    }

    removeTable();
  };

  const isDeleteButtonDisabled = isUpdatingTables || isDeletingTable;

  return (
    <>
      <div className={`jazzbar-table-component-container ${table.reference}`}>
        <div className="table-item">
          <div className="table-occupancy-information red-text">
            {locked ? "locked" : full ? "full" : ""}
          </div>

          <div className="table-number">
            <p>{table.title}</p>
            {isRemoveButtonShown && (
              <img
                className="JazzBarTableComponent__delete-icon"
                src={PortalCloseIcon}
                alt="remove table"
                onClick={toggleModal}
              />
            )}
          </div>
          <div className="JazzBarTableComponent__users">
            {users.map((user) => (
              <img
                onClick={() => openUserProfileModal(user.id)}
                key={user.id}
                className="profile-icon table-participant-picture"
                src={
                  (!user.anonMode && user.pictureUrl) || DEFAULT_PROFILE_IMAGE
                }
                title={(!user.anonMode && user.partyName) || DEFAULT_PARTY_NAME}
                alt={`${
                  (!user.anonMode && user.partyName) || DEFAULT_PARTY_NAME
                } profile`}
                width={imageSize}
                height={imageSize}
              />
            ))}

            {users &&
              table.capacity &&
              table.capacity - users.length >= 0 &&
              [...Array(table.capacity - users.length)].map((e, i) => (
                <span
                  key={i}
                  onClick={() => onJoinClicked(table.reference, locked)}
                  id={`join-table-${venue?.name}-${table.reference}`}
                  className="add-participant-button"
                >
                  +
                </span>
              ))}
          </div>
        </div>
      </div>
      <Modal
        show={isModalShown}
        onHide={hideModal}
        className="JazzBarTableModal"
        backdrop="static"
        centered
      >
        <Modal.Body>
          <div className="JazzBarTableModal__container">
            <h2>Delete table</h2>
            <p>
              WARNING: This action cannot be undone and will permantently remove{" "}
              {table.title}
            </p>
            <div className="JazzBarTableModal__buttons">
              <ButtonNG
                variant="secondary"
                onClick={hideModal}
                disabled={isDeleteButtonDisabled}
              >
                Cancel
              </ButtonNG>

              <ButtonNG
                disabled={isDeleteButtonDisabled}
                variant="danger"
                onClick={handleTableDelete}
              >
                Delete
              </ButtonNG>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
