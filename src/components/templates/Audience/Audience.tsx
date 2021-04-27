import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import firebase from "firebase/app";

import { IFRAME_ALLOW, REACTION_TIMEOUT } from "settings";

import { addReaction } from "store/actions/Reactions";

import { makeUpdateUserGridLocation } from "api/profile";

import { EmojiReactions, EmojiReactionType } from "types/reactions";
import { User } from "types/User";

import { ConvertToEmbeddableUrl } from "utils/ConvertToEmbeddableUrl";
import { WithId } from "utils/id";
import { createEmojiReaction, createTextReaction } from "utils/reactions";
import { currentVenueSelectorData } from "utils/selectors";

import { useDispatch } from "hooks/useDispatch";
import { useRecentVenueUsers } from "hooks/users";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { UserProfilePicture } from "components/molecules/UserProfilePicture";

import "./Audience.scss";

interface ChatOutDataType {
  text: string;
}

// If you change the name of these properties, make sure to also change it in Audience.scss
const SEAT_SIZE = "var(--seat-size)";
const SEAT_SIZE_MIN = "var(--seat-size-min)";

const VIDEO_MIN_WIDTH_IN_SEATS = 8;
// We should keep the 16/9 ratio
const VIDEO_MIN_HEIGHT_IN_SEATS = VIDEO_MIN_WIDTH_IN_SEATS * (9 / 16);

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
const MIN_COLUMNS = 25;
const MIN_ROWS = 19;

// capacity(n) = (((MIN_COLUMNS-1)+2n) * (MIN_ROWS+2n) * 0.75
// Columns decreases by one because of the digital fire lane.
// The video is 50% x 50% so it takes up 1/4 of the seats.
// Because both MIN_COLUMNS-1 and MIN_ROWS are both even, we don't need Math.floor to guarantee integer result..
// And we always add row above&below and a column left&right
// So auditorium size 1 has 1 extra outlined row and column around its outside versus auditorium size 0.
// The same is true for auditorium size 2 - it has an extra row and column around it versus auditorium size 1.

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

const capacity = (
  auditoriumSize: number,
  minColumns: number,
  minRows: number
) =>
  (minColumns - 1 + auditoriumSize * 2) * (minRows + auditoriumSize * 2) * 0.75;

// Never let the auditorium get more than 80% full
const requiredAuditoriumSize = (
  occupants: number,
  minColumns: number,
  minRows: number
) => {
  let size = 0;
  while (size < 10 && capacity(size, minColumns, minRows) * 0.8 < occupants) {
    size++;
  }
  return size;
};

const burningReactions = EmojiReactions.filter(
  (reaction) =>
    reaction.type !== EmojiReactionType.boo &&
    reaction.type !== EmojiReactionType.thatsjazz
);

// Note: This is the component that is used for the Auditorium
export const Audience: React.FunctionComponent = () => {
  const venueId = useVenueId();
  const { userId, userWithId } = useUser();
  const venue = useSelector(currentVenueSelectorData);
  const { recentVenueUsers } = useRecentVenueUsers();

  const minColumns = venue?.auditoriumColumns ?? MIN_COLUMNS;
  const minRows = venue?.auditoriumRows ?? MIN_ROWS;

  const [isAudioEffectDisabled, setIsAudioEffectDisabled] = useState(false);

  const [iframeUrl, setIframeUrl] = useState<string>("");

  const [hasAlreadyFocussed, setAlreadyFocussed] = useState(false);
  const focusElementOnLoad = useCallback(
    (ref: HTMLDivElement | null) => {
      if (ref && !hasAlreadyFocussed) {
        ref.scrollIntoView({
          behavior: "auto",
          block: "center",
          inline: "center",
        });

        setAlreadyFocussed(true);
      }
    },
    [hasAlreadyFocussed]
  );

  // @debt I don't think we even need to do this..? It should get updated automagically already from the venue config + our firebase subscription to it?
  useEffect(() => {
    const unsubscribeListener = firebase
      .firestore()
      .collection("venues")
      .doc(venueId as string)
      .onSnapshot((doc) =>
        setIframeUrl(ConvertToEmbeddableUrl(doc.data()?.iframeUrl || "", true))
      );

    return () => {
      unsubscribeListener();
    };
  }, [venueId]);

  const dispatch = useDispatch();

  // @debt de-duplicate this with version in src/components/templates/Jazzbar/JazzTab/JazzTab.tsx
  const reactionClicked = useCallback(
    (emojiReaction: EmojiReactionType) => {
      if (!venueId || !userWithId) return;

      dispatch(
        addReaction({
          venueId,
          reaction: createEmojiReaction(emojiReaction, userWithId),
        })
      );

      // @debt Why do we have this here..? We probably shouldn't have it/need it? It's not a very Reacty thing to do..
      setTimeout(() => (document.activeElement as HTMLElement).blur(), 1000);
    },
    [venueId, userWithId, dispatch]
  );

  const [isShoutSent, setIsShoutSent] = useState(false);

  useEffect(() => {
    if (isShoutSent) {
      setTimeout(() => {
        setIsShoutSent(false);
      }, REACTION_TIMEOUT);
    }
  }, [isShoutSent, setIsShoutSent]);

  const { register, handleSubmit, reset } = useForm<ChatOutDataType>({
    mode: "onSubmit",
  });

  // Auditorium size 0 is MIN_COLUMNS x MIN_ROWS
  // Size 1 is MIN_ROWSx2 x MIN_COLUMNS+2
  // Size 2 is MIN_ROWSx4 x MIN_COLUMNS+4 and so on
  const [auditoriumSize, setAuditoriumSize] = useState(0);

  // These are going to be translated (ie. into negative/positive per above)
  // That way, when the audience size is expanded these people keep their seats

  // FIXME: This is really bad, needs to be fixed ASAP
  const partygoersBySeat: WithId<User>[][] = [];
  let seatedPartygoers = 0;
  recentVenueUsers?.forEach((user) => {
    if (
      !venueId ||
      !user?.data ||
      user.data[venueId] === undefined ||
      user.data[venueId].row === undefined ||
      user.data[venueId].column === undefined
    )
      return;
    const row = user.data[venueId].row || 0;
    const column = user.data[venueId].column || 0;
    if (!(row in partygoersBySeat)) {
      partygoersBySeat[row] = [];
    }
    partygoersBySeat[row][column] = user;
    seatedPartygoers++;
  });

  useEffect(() => {
    setAuditoriumSize(
      requiredAuditoriumSize(seatedPartygoers, minColumns, minRows)
    );
  }, [minColumns, minRows, seatedPartygoers]);

  const rowsForSizedAuditorium = minRows + auditoriumSize * 2;
  const columnsForSizedAuditorium = minColumns + auditoriumSize * 2;

  // We use 3 because 1/3 of the size of the auditorium, and * 2 because we're calculating in halves due to using cartesian coordinates + Math.abs
  const carvedOutWidthInSeats = Math.max(
    Math.ceil(columnsForSizedAuditorium / (3 * 2)),
    VIDEO_MIN_WIDTH_IN_SEATS
  );

  // Keep a 16:9 ratio
  const carvedOutHeightInSeats = Math.max(
    Math.ceil(carvedOutWidthInSeats * (9 / 16)),
    VIDEO_MIN_HEIGHT_IN_SEATS
  );

  // Calculate the position/size for the central video container
  const videoContainerWidthInSeats = carvedOutWidthInSeats * 2 + 1;
  const videoContainerHeightInSeats = carvedOutHeightInSeats * 2 + 1;

  const videoContainerStyles = useMemo(
    () => ({
      width: `calc(${videoContainerWidthInSeats} * ${SEAT_SIZE})`,
      height: `calc(${videoContainerHeightInSeats} * ${SEAT_SIZE})`,
      minWidth: `calc(${videoContainerWidthInSeats} * ${SEAT_SIZE_MIN})`,
      minHeight: `calc(${videoContainerHeightInSeats} * ${SEAT_SIZE_MIN})`,
    }),
    [videoContainerHeightInSeats, videoContainerWidthInSeats]
  );

  const isSeat = useCallback(
    (translatedRow: number, translatedColumn: number) => {
      const isInFireLaneColumn = translatedColumn === 0;
      if (isInFireLaneColumn) return false;

      const isInVideoRow = Math.abs(translatedRow) <= carvedOutHeightInSeats;
      const isInVideoColumn =
        Math.abs(translatedColumn) <= carvedOutWidthInSeats;

      const isInVideoCarveOut = isInVideoRow && isInVideoColumn;

      return !isInVideoCarveOut;
    },
    [carvedOutWidthInSeats, carvedOutHeightInSeats]
  );

  // @debt this return useMemo antipattern should be rewritten
  return useMemo(() => {
    const takeSeat = (row: number | null, column: number | null) => {
      if (!venueId || !userId) return;

      makeUpdateUserGridLocation({
        venueId,
        userUid: userId,
      })(row, column);
    };

    const leaveSeat = () => {
      takeSeat(null, null);
    };

    const onSubmit = async (data: ChatOutDataType) => {
      if (!venueId || !userWithId) return;

      setIsShoutSent(true);

      dispatch(
        addReaction({
          venueId,
          reaction: createTextReaction(data.text, userWithId),
        })
      );

      reset();
    };

    if (!venue || !userWithId || !venueId) return null;

    const userSeated =
      typeof userWithId.data?.[venueId]?.row === "number" &&
      typeof userWithId.data?.[venueId]?.row === "number";

    const translateRow = (untranslatedRowIndex: number) =>
      untranslatedRowIndex - Math.floor(rowsForSizedAuditorium / 2);

    const translateColumn = (untranslatedColumnIndex: number) =>
      untranslatedColumnIndex - Math.floor(columnsForSizedAuditorium / 2);

    const reactionContainerClassnames = classNames("reaction-container", {
      seated: userSeated,
    });

    const renderReactionsContainer = () => (
      <>
        <div className="emoji-container">
          {burningReactions.map((reaction) => (
            <button
              key={reaction.name}
              className="reaction"
              onClick={() => reactionClicked(reaction.type)}
              id={`send-reaction-${reaction.type}`}
            >
              <span role="img" aria-label={reaction.ariaLabel}>
                {reaction.text}
              </span>
            </button>
          ))}
          <div
            className="mute-button"
            onClick={() => setIsAudioEffectDisabled((state) => !state)}
          >
            <FontAwesomeIcon
              className="reaction"
              icon={isAudioEffectDisabled ? faVolumeMute : faVolumeUp}
            />
          </div>
          <button className="leave-seat-button" onClick={leaveSeat}>
            Leave Seat
          </button>
        </div>
        <div className="shout-container">
          <form onSubmit={handleSubmit(onSubmit)} className="shout-form">
            <input
              name="text"
              className="text"
              placeholder="Shout out to the crowd"
              ref={register({ required: true })}
              disabled={isShoutSent}
              autoComplete="off"
            />
            <input
              className={`shout-button ${isShoutSent ? "btn-success" : ""} `}
              type="submit"
              id={`send-shout-out-${venue.name}`}
              value={isShoutSent ? "Sent!" : "Send"}
              disabled={isShoutSent}
            />
          </form>
        </div>
      </>
    );

    const renderInstructions = () => (
      <div className="instructions">
        Welcome! Click on an empty seat to claim it!
      </div>
    );

    return (
      <>
        <div
          className="audience-container"
          style={{
            backgroundImage: venue.mapBackgroundImageUrl
              ? `url(${venue.mapBackgroundImageUrl})`
              : undefined,
          }}
        >
          <div className="audience">
            <div className="audience-overlay">
              <div
                ref={focusElementOnLoad}
                className="video-container"
                style={videoContainerStyles}
              >
                <div className="video">
                  <iframe
                    className="frame"
                    src={iframeUrl}
                    title="Video"
                    frameBorder="0"
                    allow={IFRAME_ALLOW}
                    allowFullScreen
                  />
                </div>

                {venue.showReactions && (
                  <div className={reactionContainerClassnames}>
                    {userSeated
                      ? renderReactionsContainer()
                      : renderInstructions()}
                  </div>
                )}
              </div>
            </div>

            {/* @debt can we refactor this to re-use useMapGrid, MapCell, usePartygoersOverlay, MapPartygoerOverlay, usePartygoersbySeat, etc? */}
            {Array.from(Array(rowsForSizedAuditorium)).map(
              (_, untranslatedRowIndex) => {
                const row = translateRow(untranslatedRowIndex);
                return (
                  <div key={untranslatedRowIndex} className="seat-row">
                    {Array.from(Array(columnsForSizedAuditorium)).map(
                      (_, untranslatedColumnIndex) => {
                        const column = translateColumn(untranslatedColumnIndex);
                        const isOnRight = column >= 0;
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
                              seat &&
                              seatedPartygoer === null &&
                              takeSeat(row, column)
                            }
                          >
                            {seat && seatedPartygoer && (
                              <UserProfilePicture
                                user={seatedPartygoer}
                                reactionPosition={isOnRight ? "left" : "right"}
                                miniAvatars={venue.miniAvatars}
                                isAudioEffectDisabled={isAudioEffectDisabled}
                              />
                            )}
                            {seat && !seatedPartygoer && <>+</>}
                          </div>
                        );
                      }
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>
      </>
    );
  }, [
    venue,
    venueId,
    focusElementOnLoad,
    videoContainerStyles,
    iframeUrl,
    rowsForSizedAuditorium,
    userId,
    userWithId,
    dispatch,
    reset,
    columnsForSizedAuditorium,
    isAudioEffectDisabled,
    handleSubmit,
    register,
    isShoutSent,
    reactionClicked,
    isSeat,
    partygoersBySeat,
  ]);
};
