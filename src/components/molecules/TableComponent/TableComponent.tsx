import React from "react";
import { Modal } from "react-bootstrap";
import { useAsyncFn, useCss } from "react-use";
import classNames from "classnames";

import { DEFAULT_PARTY_NAME, DEFAULT_PROFILE_IMAGE } from "settings";

import { deleteTable } from "api/table";

import { TableComponentPropsType } from "types/Table";
import { VenueTemplate } from "types/venues";

import { useIsAdminUser } from "hooks/roles";
import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";

import { TABLES as CONVERSATION_TABLES } from "components/templates/ConversationSpace/constants";
import { JAZZBAR_TABLES } from "components/templates/Jazzbar/JazzBar/constants";

import { ButtonNG } from "components/atoms/ButtonNG";

import PortalCloseIcon from "assets/icons/icon-close-portal.svg";

import "./TableComponent.scss";

const TableComponent: React.FunctionComponent<TableComponentPropsType> = ({
  users,
  onJoinClicked,
  imageSize = 50,
  table,
  tableLocked,
  venue,
  type,
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
      defaultTables:
        venue.template === VenueTemplate.jazzbar
          ? JAZZBAR_TABLES
          : CONVERSATION_TABLES,
    });

    toggleModal();
  }, [table.reference, venue.id, venue.template, toggleModal]);

  const isDeleteButtonDisabled = isDeletingTable;

  const isJazzBar = type === VenueTemplate.jazzbar;

  const itemStyles = useCss(
    isJazzBar
      ? {}
      : {
          height: `${table.rows && table.rows * 50 + 65}px`,
          width: `${table.columns && (table.columns + 1) * 55}px`,
        }
  );

  const itemClasses = classNames("TableComponent__item", itemStyles);

  const itemWrapperStyles = useCss({
    width: isJazzBar ? "60%" : "65%",
  });

  const itemWrapperClasses = classNames(
    "TableComponent__item-wrapper",
    itemWrapperStyles
  );

  return (
    <div className={`TableComponent ${table.reference}`}>
      <div className={itemClasses}>
        <div className="TableComponent__occupancy-warning">
          {locked ? "locked" : full ? "full" : ""}
        </div>
        <div className={itemWrapperClasses}>
          {table.title}

          {isRemoveButtonShown && (
            <img
              className="TableComponent__delete-icon"
              src={PortalCloseIcon}
              alt="remove table"
              onClick={toggleModal}
            />
          )}
        </div>
        <div className="TableComponent__users">
          {users &&
            users.length >= 0 &&
            users.map((user) => (
              <img
                onClick={() => openUserProfileModal(user.id)}
                key={user.id}
                className="TableComponent__profile-icon"
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
                className="TableComponent__add-user"
              >
                +
              </span>
            ))}
        </div>
      </div>
      <Modal
        show={isModalShown}
        onHide={hideModal}
        className="TableComponent__modal"
        backdrop="static"
        centered
      >
        <Modal.Body>
          <div className="TableComponent__modal-container">
            <h2>Delete table</h2>
            <p>
              WARNING: This action cannot be undone and will permantently remove{" "}
              {table.title}
            </p>
            <div className="TableComponent__modal-buttons">
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
                onClick={removeTable}
              >
                Delete
              </ButtonNG>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TableComponent;
