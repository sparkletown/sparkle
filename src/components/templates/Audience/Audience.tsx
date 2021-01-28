import React, { useCallback, useEffect, useMemo, useState } from "react";
import firebase, { UserInfo } from "firebase/app";

// Components
import {
  EmojiReactionType,
  Reactions,
  TextReactionType,
} from "utils/reactions";
import { faVolumeMute, faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ChatDrawer from "components/organisms/ChatDrawer";
import UserProfileModal from "components/organisms/UserProfileModal";
import UserProfilePicture from "components/molecules/UserProfilePicture";

// Hooks
import { useForm } from "react-hook-form";
import { useDispatch } from "hooks/useDispatch";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";
import { usePartygoers } from "hooks/users";

// Utils | Settings | Constants
import { ConvertToEmbeddableUrl } from "utils/ConvertToEmbeddableUrl";
import { IFRAME_ALLOW, REACTION_TIMEOUT } from "settings";
import { WithId } from "utils/id";
import { currentVenueSelectorData } from "utils/selectors";

// Typings
import { User } from "types/User";

// Styles
import "./Audience.scss";
import { VideoAspectRatio } from "types/VideoAspectRatio";
import { addReaction } from "store/actions/Reactions";

type ReactionType =
  | { reaction: EmojiReactionType }
  | { reaction: TextReactionType; text: string };

interface ChatOutDataType {
  text: string;
}

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

export const Audience: React.FunctionComponent = () => {
  const venueId = useVenueId();
  const { user, profile } = useUser();
  const venue = useSelector(currentVenueSelectorData);
  const partygoers = usePartygoers();

  const minColumns = venue?.auditoriumColumns ?? MIN_COLUMNS;
  const minRows = venue?.auditoriumRows ?? MIN_ROWS;

  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();
  const [isAudioEffectDisabled, setIsAudioEffectDisabled] = useState(false);

  const [iframeUrl, setIframeUrl] = useState<string>("");

  useEffect(() => {
    firebase
      .firestore()
      .collection("venues")
      .doc(venueId as string)
      .onSnapshot((doc) =>
        setIframeUrl(ConvertToEmbeddableUrl(doc.data()?.iframeUrl || "", true))
      );
  }, [venueId]);

  const dispatch = useDispatch();

  const createReaction = (reaction: ReactionType, user: UserInfo) => ({
    created_at: new Date().getTime(),
    created_by: user.uid,
    ...reaction,
  });
  const reactionClicked = useCallback(
    (user: UserInfo, reaction: EmojiReactionType) => {
      dispatch(
        addReaction({
          venueId,
          reaction: createReaction({ reaction }, user),
        })
      );
      setTimeout(() => (document.activeElement as HTMLElement).blur(), 1000);
    },
    [venueId, dispatch]
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
  partygoers?.forEach((partygoer) => {
    if (
      !venueId ||
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

  useEffect(() => {
    setAuditoriumSize(
      requiredAuditoriumSize(seatedPartygoers, minColumns, minRows)
    );
  }, [minColumns, minRows, seatedPartygoers]);

  const rowsForSizedAuditorium = minRows + auditoriumSize * 2;
  const columnsForSizedAuditorium = minColumns + auditoriumSize * 2;

  const isSeat = useCallback(
    (translatedRow: number, translatedColumn: number) => {
      const isInFireLaneColumn = translatedColumn === 0;
      if (isInFireLaneColumn) return false;

      const isInVideoRow =
        Math.abs(translatedRow) <= Math.floor(rowsForSizedAuditorium / 3);

      const isInVideoColumn =
        Math.abs(translatedColumn) <= Math.floor(columnsForSizedAuditorium / 4);

      const isInVideoCarveOut = isInVideoRow && isInVideoColumn;

      return !isInVideoCarveOut;
    },
    [columnsForSizedAuditorium, rowsForSizedAuditorium]
  );

  return useMemo(() => {
    const takeSeat = (
      translatedRow: number | null,
      translatedColumn: number | null
    ) => {
      if (!user || !profile || !venueId) return;
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

    const leaveSeat = () => {
      takeSeat(null, null);
    };

    const onSubmit = async (data: ChatOutDataType) => {
      setIsShoutSent(true);
      user &&
        dispatch(
          addReaction({
            venueId,
            reaction: createReaction(
              { reaction: "messageToTheBand", text: data.text },
              user
            ),
          })
        );
      reset();
    };

    if (!venue || !profile || !venueId) return <></>;

    const burningReactions = Reactions.filter(
      (reaction) =>
        reaction.type !== EmojiReactionType.boo &&
        reaction.type !== EmojiReactionType.thatsjazz
    );
    const userSeated =
      typeof profile.data?.[venueId]?.row === "number" &&
      typeof profile.data?.[venueId]?.row === "number";

    const translateRow = (untranslatedRowIndex: number) =>
      untranslatedRowIndex - Math.floor(rowsForSizedAuditorium / 2);

    const translateColumn = (untranslatedColumnIndex: number) =>
      untranslatedColumnIndex - Math.floor(columnsForSizedAuditorium / 2);

    const videoFrameClasses = `frame ${
      venue.videoAspect === VideoAspectRatio.SixteenNine ? "aspect-16-9" : ""
    }`;

    const renderReactionsContainer = () => (
      <>
        <div className="emoji-container">
          {burningReactions.map((reaction) => (
            <button
              key={reaction.name}
              className="reaction"
              onClick={() => user && reactionClicked(user, reaction.type)}
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
          style={{ backgroundImage: `url(${venue.mapBackgroundImageUrl})` }}
        >
          <div className="video-container">
            <div className="video">
              <iframe
                className={videoFrameClasses}
                src={iframeUrl}
                title="Video"
                frameBorder="0"
                allow={IFRAME_ALLOW}
                allowFullScreen
              />
            </div>
            {venue.showReactions && (
              <div
                className={`reaction-container ${userSeated ? "seated" : ""}`}
              >
                {userSeated ? renderReactionsContainer() : renderInstructions()}
              </div>
            )}
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
                              seat && seatedPartygoer === null
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
                                  reactionPosition={
                                    isOnRight ? "left" : "right"
                                  }
                                  avatarClassName={"profile-avatar"}
                                  setSelectedUserProfile={
                                    setSelectedUserProfile
                                  }
                                  miniAvatars={venue.miniAvatars}
                                  isAudioEffectDisabled={isAudioEffectDisabled}
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
              title={`${venue.name ?? "Auditorium"} Q&A`}
              roomName={venue.name}
              chatInputPlaceholder="Ask a question"
              defaultShow={true}
            />
          </div>
          <UserProfileModal
            show={selectedUserProfile !== undefined}
            onHide={() => setSelectedUserProfile(undefined)}
            userProfile={selectedUserProfile}
          />
        </div>
      </>
    );
  }, [
    venue,
    profile,
    venueId,
    iframeUrl,
    isAudioEffectDisabled,
    handleSubmit,
    register,
    isShoutSent,
    rowsForSizedAuditorium,
    selectedUserProfile,
    user,
    reset,
    reactionClicked,
    columnsForSizedAuditorium,
    isSeat,
    partygoersBySeat,
    dispatch,
  ]);
};
