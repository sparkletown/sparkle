import React, { useCallback, useMemo, useState } from "react";
import { useAsyncFn } from "react-use";
import { Card } from "components/attendee/Card";
import { CardBody } from "components/attendee/Card/CardBody";
import { CardButton } from "components/attendee/Card/CardButton";
import { Popover } from "components/attendee/Popover";

import { CONVERSATION_TABLES, JAZZBAR_TABLES, STRING_SPACE } from "settings";

import { deleteTable } from "api/table";

import { TableComponentPropsType } from "types/Table";
import { VenueTemplate } from "types/VenueTemplate";

import { useAdminRole } from "hooks/user/useAdminRole";
import { useShowHide } from "hooks/useShowHide";

import { ModalTitle } from "components/molecules/Modal/ModalTitle";

import { UserAvatar } from "components/atoms/UserAvatar";

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
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );

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
        <h2 className={styles.tableTitle}>{table.title}</h2>

        {isRemoveButtonShown && (
          <span
            className={styles.deleteButton}
            onClick={toggleModal}
            ref={setReferenceElement}
          >
            Delete
          </span>
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

        {isModalShown && (
          <Popover referenceElement={referenceElement}>
            <Card>
              <CardBody>
                <ModalTitle>Delete table</ModalTitle>

                <p>
                  WARNING: This action cannot be undone and will permanently
                  remove
                  {STRING_SPACE}
                  {table.title}
                </p>
                <div></div>
              </CardBody>

              <CardButton onClick={hideModal} disabled={isDeletingTable}>
                Cancel
              </CardButton>
              <CardButton
                disabled={isDeletingTable}
                variant="danger"
                onClick={removeTable}
              >
                Delete
              </CardButton>
            </Card>
          </Popover>
        )}
      </div>
    </div>
  );
};
