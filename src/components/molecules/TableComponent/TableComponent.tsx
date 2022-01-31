import React from "react";
import { useAsyncFn, useCss } from "react-use";
import classNames from "classnames";

import {
  CONVERSATION_TABLES,
  DEFAULT_PARTY_NAME,
  JAZZBAR_TABLES,
  STRING_PLUS,
  STRING_SPACE,
} from "settings";

import { deleteTable } from "api/table";

import { TableComponentPropsType } from "types/Table";
import { VenueTemplate } from "types/VenueTemplate";

import { determineAvatar } from "utils/image";

import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useAdminRole } from "hooks/user/useAdminRole";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";

import { Modal } from "components/molecules/Modal";

import { ButtonNG } from "components/atoms/ButtonNG";

import PortalCloseIcon from "assets/icons/icon-close-portal.svg";

import "./TableComponent.scss";

export const TableComponent: React.FunctionComponent<TableComponentPropsType> = ({
  users,
  onJoinClicked,
  imageSize = 50,
  table,
  tableLocked,
  venue,
  template,
}) => {
  const { openUserProfileModal } = useProfileModalControls();
  const locked = tableLocked(table.reference);
  const numberOfSeatsLeft = table.capacity && table.capacity - users.length;
  const full = numberOfSeatsLeft === 0;
  const { userId } = useUser();

  const { isAdminUser, isLoading: isCheckingRole } = useAdminRole({ userId });

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

  const isJazzBar = template === VenueTemplate.jazzbar;

  const itemStyles = useCss(
    isJazzBar
      ? {}
      : {
          height: `${table.rows && table.rows * 50 + 65}px`,
          width: `${table.columns && (table.columns + 1) * 55}px`,
        }
  );

  const itemClasses = classNames("TableComponent__item", itemStyles);

  return (
    <div className="TableComponent">
      <div className={itemClasses}>
        <div className="TableComponent__occupancy-warning">
          {locked && "locked"}
          {!locked && full && "full"}
        </div>
        <div className="TableComponent__item-wrapper">
          <span className="TableComponent__title">{table.title}</span>

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
                src={determineAvatar({ user })}
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
                {STRING_PLUS}
              </span>
            ))}
        </div>
      </div>
      <Modal
        isOpen={isModalShown}
        onClose={hideModal}
        className="TableComponent__modal"
        isCentered
      >
        <div className="TableComponent__modal-container">
          <h2>Delete table</h2>
          <p>
            WARNING: This action cannot be undone and will permanently remove
            {STRING_SPACE}
            {table.title}
          </p>
          <div className="TableComponent__modal-buttons">
            <ButtonNG
              variant="secondary"
              onClick={hideModal}
              disabled={isDeletingTable}
            >
              Cancel
            </ButtonNG>

            <ButtonNG
              disabled={isDeletingTable}
              variant="danger"
              onClick={removeTable}
            >
              Delete
            </ButtonNG>
          </div>
        </div>
      </Modal>
    </div>
  );
};
