import React, { useMemo, useState } from "react";
import firebase from "firebase/app";
import { useSelector } from "hooks/useSelector";
import { User } from "types/User";
import { WithId } from "utils/id";
import { useParams } from "react-router-dom";

import "./Audience.scss";
import UserProfileModal from "components/organisms/UserProfileModal";
import { useUser } from "hooks/useUser";

type PropsType = {};

// The seat grid is designed so we can dynamically add rows and columns around the outside when occupancy gets too high.
// That way we never run out of digital seats.
// How the seat grid works:
// Left-most column is -1*Math.floor(COLUMNS/2)
// Right-most column is Math.floor(COLUMNS/2)
// Always have an odd number of columns
// Column zero has no seats, this is our virtual fire lane.

// Example row:
// -4 -3 -2 -1  0  1  2  3  4
// Consumed by video (5/9) = +/- Math.floor(9/4) = [-2,2]
// -4 -3  V  V  V  V  V  3  4

// The same logic applies to the rows.

// The video window always takes up the middle 50% of seats.
// Example: if 17 columns, Math.ceil(17/2) = 9 of them are not available to leave room for the video.

// The video window is absolutely positioned at 50%,50%, has width: 50%
// So anything behind the video should not be a seat

// Hardcode these for now; let's make them dynamic so occupancy cannot exceed 80%
// Always have an odd number of columns.
const MIN_COLUMNS = 17;
const MIN_ROWS = 12;

export const Audience: React.FunctionComponent<PropsType> = ({}) => {
  const { venueId } = useParams();
  const { user, profile } = useUser();
  const { venue, partygoers } = useSelector((state) => ({
    partygoers: state.firestore.ordered.partygoers,
    venue: state.firestore.data.currentVenue,
  }));
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();

  // Use state when this becomes dynamic
  const rowCount = MIN_ROWS;
  const columnCount = MIN_COLUMNS;

  const translateRow = (untranslatedRowIndex: number) =>
    untranslatedRowIndex - Math.floor(rowCount / 2);
  const translateColumn = (untranslatedColumnIndex: number) =>
    (untranslatedColumnIndex = Math.floor(columnCount / 2));

  // These are going to be translated (ie. into negative/positive per above)
  // That way, when the audience size is expanded these people keep their seats
  const partygoersBySeat: WithId<User>[][] = [];
  partygoers.forEach((partygoer) => {
    if (
      !partygoer?.data ||
      partygoer.data[venueId] === undefined ||
      partygoer.data[venueId].row === undefined ||
      partygoer.data[venueId].column === undefined
    )
      return;
    const row = partygoer.data[venueId].row || 0;
    const column = partygoer.data[venueId].column || 0;
    if (!(row in partygoersBySeat)) {
      partygoersBySeat[row] = [];
    }
    partygoersBySeat[row][column] = partygoer;
  });

  const isSeat = (row: number, column: number) => {
    const isInFireLaneColumn = column === 0;
    if (isInFireLaneColumn) return false;

    const isInVideoRow = Math.abs(row) <= Math.floor(rowCount / 4);
    const isInVideoColumn = Math.abs(column) <= Math.floor(columnCount / 4);
    const isInVideoCarveOut = isInVideoRow && isInVideoColumn;
    return !isInVideoCarveOut;
  };

  const takeSeat = (row: number, column: number) => {
    if (!user || !profile) return;
    const doc = `users/${user.uid}`;
    const existingData = profile?.data;
    const update = {
      data: {
        ...existingData,
        [venueId]: {
          row,
          column,
        },
      },
    };
    const firestore = firebase.firestore();
    firestore
      .doc(doc)
      .update(update)
      .catch(() => {
        firestore.doc(doc).set(update);
      });
  };

  return useMemo(
    () => (
      <div className="audience-container">
        <div className="video">
          <iframe src={venue?.iframeUrl} />
        </div>
        <div className="audience">
          {Array.from(Array(rowCount)).map((_, untranslatedRowIndex) => {
            const row = translateRow(untranslatedRowIndex);
            return (
              <div className="seat-row">
                {Array.from(Array(columnCount)).map(
                  (_, untranslatedColumnIndex) => {
                    const column = translateColumn(untranslatedColumnIndex);
                    const seat = isSeat(row, column);
                    const seatedPartygoer = partygoersBySeat?.[row]?.[column]
                      ? partygoersBySeat[row][column]
                      : null;
                    return (
                      <div
                        className={seat ? "seat" : "not-seat"}
                        onClick={() =>
                          seat && seatedPartygoer !== null
                            ? takeSeat(row, column)
                            : seatedPartygoer !== null
                            ? setSelectedUserProfile(seatedPartygoer)
                            : null
                        }
                      >
                        {seatedPartygoer && (
                          <div className="user">
                            <img
                              className="profile-image"
                              src={seatedPartygoer.pictureUrl}
                              title={`${seatedPartygoer}'s profile image`}
                              alt={`${seatedPartygoer}'s profile image`}
                            />
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            );
          })}
        </div>
        <UserProfileModal
          show={selectedUserProfile !== undefined}
          onHide={() => setSelectedUserProfile(undefined)}
          userProfile={selectedUserProfile}
        />
      </div>
    ),
    []
  );
};
