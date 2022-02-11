import React, { useMemo } from "react";
import { useAsyncFn } from "react-use";

import {
  CONVERSATION_TABLES,
  DEFAULT_PARTY_NAME,
  JAZZBAR_TABLES,
  STRING_SPACE,
} from "settings";

import { deleteTable } from "api/table";

import { TableComponentPropsType } from "types/Table";
import { VenueTemplate } from "types/VenueTemplate";

import { determineAvatar } from "utils/image";

import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useAdminRole } from "hooks/user/useAdminRole";
import { useShowHide } from "hooks/useShowHide";

import { Modal } from "components/molecules/Modal";

import { ButtonNG } from "components/atoms/ButtonNG";

import PortalCloseIcon from "assets/icons/icon-close-portal.svg";

import styles from "./TableComponent.module.scss";

export const TableComponent: React.FunctionComponent<TableComponentPropsType> = ({
  users,
  onJoinClicked,
  imageSize = 50,
  table,
  tableLocked,
  venue,
  userId,
  template,
}) => {
  const { openUserProfileModal } = useProfileModalControls();
  const locked = tableLocked(table.reference);
  const numberOfSeatsLeft = table.capacity && table.capacity - users.length;
  const full = numberOfSeatsLeft === 0;

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

  const renderedUserPictures = useMemo(
    () =>
      users &&
      users.length >= 0 &&
      users.map((user) => {
        const { src: profilePic, onError: onLoadError } = determineAvatar({
          user,
        });

        return (
          <img
            onClick={() => openUserProfileModal(user.id)}
            key={user.id}
            className={styles.userAvatar}
            src={profilePic}
            onError={onLoadError}
            title={user.partyName || DEFAULT_PARTY_NAME}
            alt={`${user.partyName || DEFAULT_PARTY_NAME} profile`}
            width={imageSize}
            height={imageSize}
          />
        );
      }),
    [imageSize, openUserProfileModal, users]
  );

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        {isRemoveButtonShown && (
          <img
            className={styles.deleteButton}
            src={PortalCloseIcon}
            alt="remove table"
            onClick={toggleModal}
          />
        )}
        <div>
          {locked && "locked"}
          {!locked && full && "full"}
        </div>
        <span>{table.title}</span>
      </div>
      <div className={styles.tableUsers}>
        {renderedUserPictures}

        {users && table.capacity && table.capacity - users.length >= 0 && (
          <span
            key={"join-button"}
            onClick={() => onJoinClicked(table.reference, locked)}
            id={`join-table-${venue?.name}-${table.reference}`}
            className={styles.joinButton}
          >
            Join
          </span>
        )}
        <Modal show={isModalShown} onHide={hideModal} centered bgVariant="dark">
          <div>
            <h2>Delete table</h2>
            <p>
              WARNING: This action cannot be undone and will permanently remove
              {STRING_SPACE}
              {table.title}
            </p>
            <div>
              <ButtonNG
                variant="secondary"
                onClick={hideModal}
                disabled={isDeletingTable}
              >
                Cancel
              </ButtonNG>

              <ButtonNG
                disabled={isDeletingTable}
                variant="secondary"
                onClick={removeTable}
              >
                Delete
              </ButtonNG>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};
