import React, { useMemo, useState, useEffect } from "react";
import firebase from "firebase/app";
import { useSelector } from "hooks/useSelector";
import { User } from "types/User";
import { WithId } from "utils/id";
import { useParams } from "react-router-dom";

import "./Audience.scss";
import UserProfileModal from "components/organisms/UserProfileModal";
import { useUser } from "hooks/useUser";
import ChatDrawer from "components/organisms/ChatDrawer";
import UserProfilePicture from "components/molecules/UserProfilePicture";
import { ExperienceContextWrapper } from "components/context/ExperienceContext";

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
const MIN_ROWS = 13;

// capacity(n) = (((MIN_COLUMNS-1)+2n) * (MIN_ROWS+2n) * 0.75
// Columns decreases by one because of the digital fire lane.
// The video is 50% x 50% so it takes up 1/4 of the seats.
// Because both MIN_COLUMNS-1 and MIN_ROWS are both even, we don't need Math.floor to guarantee integer result..
// And we always add row above&below and a column left&right
// So auditorium size 1 has 1 extra outlined row and column around its outside versus auditorium size 0.
// The same is true for auditoriumn size 2 - it has an extra row and column around it versus auditorium size 1.

// Example:

// size 0
//
//   s s s s s s s s . s s s s s s s s
//   s s s s s s s s . s s s s s s s s
//   s s s s s s s s . s s s s s s s s
//   s s s s . . . . . . . . . s s s s
//   s s s s . . . . . . . . . s s s s
//   s s s s . . . . . . . . . s s s s
//   s s s s . . . . . . . . . s s s s
//   s s s s . . . . . . . . . s s s s
//   s s s s . . . . . . . . . s s s s
//   s s s s s s s s . s s s s s s s s
//   s s s s s s s s . s s s s s s s s
//   s s s s s s s s . s s s s s s s s

// size 1
//
//   s s s s s s s s s . s s s s s s s s s
//   s s s s s s s s s . s s s s s s s s s
//   s s s s s s s s s . s s s s s s s s s
//   s s s s s s s s s . s s s s s s s s s
//   s s s s . . . . . . . . . . . s s s s
//   s s s s . . . . . . . . . . . s s s s
//   s s s s . . . . . . . . . . . s s s s
//   s s s s . . . . . . . . . . . s s s s
//   s s s s . . . . . . . . . . . s s s s
//   s s s s . . . . . . . . . . . s s s s
//   s s s s . . . . . . . . . . . s s s s
//   s s s s s s s s s . s s s s s s s s s
//   s s s s s s s s s . s s s s s s s s s
//   s s s s s s s s s . s s s s s s s s s

// But it takes up the same amount of space.

const capacity = (auditoriumSize: number) =>
  (MIN_COLUMNS - 1 + auditoriumSize * 2) *
  (MIN_ROWS + auditoriumSize * 2) *
  0.75;
// Never let the auditorium get more than 80% full
const requiredAuditoriumSize = (occupants: number) => {
  let size = 0;
  while (size < 10 && capacity(size) * 0.8 < occupants) {
    size++;
  }
  return size;
};

export const Audience: React.FunctionComponent<PropsType> = () => {
  const { venueId } = useParams();
  const { user, profile } = useUser();
  const { venue, partygoers } = useSelector((state) => ({
    partygoers: state.firestore.ordered.partygoers,
    venue: state.firestore.data.currentVenue,
  }));
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();

  // Auditorium size 0 is MIN_COLUMNS x MIN_ROWS
  // Size 1 is MIN_ROWSx2 x MIN_COLUMNS+2
  // Size 2 is MIN_ROWSx4 x MIN_COLUMNS+4 and so on
  const [auditoriumSize, setAuditoriumSize] = useState(0);

  // These are going to be translated (ie. into negative/positive per above)
  // That way, when the audience size is expanded these people keep their seats
  const partygoersBySeat: WithId<User>[][] = [];
  let seatedPartygoers = 0;
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
    seatedPartygoers++;
  });

  useEffect(() => setAuditoriumSize(requiredAuditoriumSize(seatedPartygoers)), [
    seatedPartygoers,
  ]);

  return useMemo(() => {
    const rowsForSizedAuditorium = MIN_ROWS + auditoriumSize * 2;
    const columnsForSizedAuditorium = MIN_COLUMNS + auditoriumSize * 2;

    const translateRow = (untranslatedRowIndex: number) =>
      untranslatedRowIndex - Math.floor(rowsForSizedAuditorium / 2);
    const translateColumn = (untranslatedColumnIndex: number) =>
      untranslatedColumnIndex - Math.floor(columnsForSizedAuditorium / 2);

    const isSeat = (translatedRow: number, translatedColumn: number) => {
      const isInFireLaneColumn = translatedColumn === 0;
      if (isInFireLaneColumn) return false;

      const isInVideoRow =
        Math.abs(translatedRow) <= Math.floor(rowsForSizedAuditorium / 4);
      const isInVideoColumn =
        Math.abs(translatedColumn) <= Math.floor(columnsForSizedAuditorium / 4);
      const isInVideoCarveOut = isInVideoRow && isInVideoColumn;
      return !isInVideoCarveOut;
    };

    const takeSeat = (translatedRow: number, translatedColumn: number) => {
      if (!user || !profile) return;
      const doc = `users/${user.uid}`;
      const existingData = profile?.data;
      const update = {
        data: {
          ...existingData,
          [venueId]: {
            row: translatedRow,
            column: translatedColumn,
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

    if (!venue) return <></>;

    return (
      <ExperienceContextWrapper venueName={venueId}>
        <div
          className="audience-container"
          style={{ backgroundImage: `url(${venue?.mapBackgroundImageUrl})` }}
        >
          <div className="video-container">
            <div className="video">
              <iframe
                className="frame"
                src={venue?.iframeUrl}
                title="Video"
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
          <div className="audience">
            {Array.from(Array(rowsForSizedAuditorium)).map(
              (_, untranslatedRowIndex) => {
                const row = translateRow(untranslatedRowIndex);
                return (
                  <div key={untranslatedRowIndex} className="seat-row">
                    {Array.from(Array(columnsForSizedAuditorium)).map(
                      (_, untranslatedColumnIndex) => {
                        const column = translateColumn(untranslatedColumnIndex);
                        const seat = isSeat(row, column);
                        const seatedPartygoer = partygoersBySeat?.[row]?.[
                          column
                        ]
                          ? partygoersBySeat[row][column]
                          : null;
                        return (
                          <div
                            key={untranslatedColumnIndex}
                            className={seat ? "seat" : "not-seat"}
                            onClick={() =>
                              seat && seatedPartygoer !== null
                                ? takeSeat(row, column)
                                : seatedPartygoer !== null
                                ? setSelectedUserProfile(seatedPartygoer)
                                : null
                            }
                          >
                            {seat && seatedPartygoer && (
                              <div className="user">
                                <UserProfilePicture
                                  user={seatedPartygoer}
                                  setSelectedUserProfile={
                                    setSelectedUserProfile
                                  }
                                  imageSize={undefined}
                                />
                              </div>
                            )}
                            {seat && !seatedPartygoer && (
                              <span className="add-participant-button">+</span>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                );
              }
            )}
          </div>
          <div className="chat-container">
            <ChatDrawer
              title={`${venue.name ?? "Audience"} Chat`}
              roomName={venue.name}
              chatInputPlaceholder="Chat"
              defaultShow={true}
            />
          </div>
          <UserProfileModal
            show={selectedUserProfile !== undefined}
            onHide={() => setSelectedUserProfile(undefined)}
            userProfile={selectedUserProfile}
          />
        </div>
      </ExperienceContextWrapper>
    );
  }, [
    user,
    profile,
    venue,
    venueId,
    auditoriumSize,
    partygoersBySeat,
    selectedUserProfile,
    setSelectedUserProfile,
  ]);
};
