import React, { useCallback, useMemo } from "react";
import { useAsyncFn } from "react-use";

import { CONVERSATION_TABLES, JAZZBAR_TABLES, STRING_SPACE } from "settings";

import { deleteTable } from "api/table";

import { TableComponentPropsType } from "types/Table";
import { VenueTemplate } from "types/VenueTemplate";

import { useAdminRole } from "hooks/user/useAdminRole";
import { useShowHide } from "hooks/useShowHide";

import { Modal } from "components/molecules/Modal";
import { ModalTitle } from "components/molecules/Modal/ModalTitle";

import { ButtonNG } from "components/atoms/ButtonNG";
import { UserAvatar } from "components/atoms/UserAvatar";

import PortalCloseIcon from "assets/icons/icon-close-portal.svg";

import styles from "./TableComponent.module.scss";

export const TableComponent: React.FunctionComponent<TableComponentPropsType> = ({
  users,
  onJoinClicked,
  table,
  tableLocked,
  space,
  userId,
}) => {
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
    if (!space.id) return;

    await deleteTable({
      venueId: space.id,
      tableName: table.reference,
      defaultTables:
        space.template === VenueTemplate.jazzbar
          ? JAZZBAR_TABLES
          : CONVERSATION_TABLES,
    });

    toggleModal();
  }, [table.reference, space.id, space.template, toggleModal]);

  const renderedUserPictures = useMemo(
    () =>
      users &&
      users.length >= 0 &&
      users.map((user) => (
        <UserAvatar
          key={user.id}
          containerClassName={styles.userAvatar}
          user={user}
        />
      )),
    [users]
  );

  const joinClickedCallback = useCallback(
    () => onJoinClicked(table.reference, locked),
    [onJoinClicked, table.reference, locked]
  );

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <span className={styles.tableTitle}>{table.title}</span>

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
      </div>
      <div className={styles.tableUsers}>
        {renderedUserPictures}

        {users && table.capacity && table.capacity - users.length >= 0 && (
          <span onClick={joinClickedCallback} className={styles.joinButton}>
            Join
          </span>
        )}
        <Modal show={isModalShown} onHide={hideModal} centered bgVariant="dark">
          <div>
            <ModalTitle>Delete table</ModalTitle>
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
