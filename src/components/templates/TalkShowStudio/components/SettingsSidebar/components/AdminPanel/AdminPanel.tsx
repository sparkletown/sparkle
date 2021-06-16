import React, { FC, useCallback, useState } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";

import { FullTalkShowVenue, VenueTemplate } from "types/venues";
import { PlaceInTalkShowStudioVenue, User } from "types/User";
import { AllEmojiReactions, EmojiReactionType } from "types/reactions";

import { updateUserTalkShowStudioExperience, updateVenue_v2 } from "api/admin";

import { WithId } from "utils/id";

import { useVenueId } from "hooks/useVenueId";
import { useShowHide } from "hooks/useShowHide";
import { useUser } from "hooks/useUser";

import Button from "components/atoms/Button";

import { LeaveStageModal } from "components/templates/TalkShowStudio/components/LeaveStageModal";
import { useStage } from "components/templates/TalkShowStudio/useStage";

import "./AdminPanel.scss";

const requestEmoji = AllEmojiReactions.find(
  (emoji) => emoji.type === EmojiReactionType.request
)!;

export interface AdminPanelProps {
  venue: WithId<FullTalkShowVenue>;
}

const AdminPanel: FC<AdminPanelProps> = ({ venue }) => {
  const venueId = useVenueId();
  const { user: loggedUser, userId: loggedUserId } = useUser();
  const { peopleOnStage, peopleRequesting, screenSharingUser } = useStage();
  const {
    isShown: isLeaveStageModalVisible,
    show: showLeaveStageModal,
    hide: hideLeaveStageModal,
  } = useShowHide();
  const [userToRemove, setUserToRemove] = useState<WithId<User>>();

  const removeUserFromStage = useCallback(() => {
    venueId &&
      userToRemove &&
      updateUserTalkShowStudioExperience(venueId, userToRemove.id, {
        place: PlaceInTalkShowStudioVenue.audience,
        isSharingScreen: false,
        isMuted: false,
      });
  }, [userToRemove, venueId]);

  const muteUser = useCallback(
    (userId: string) => {
      venueId &&
        updateUserTalkShowStudioExperience(venueId, userId, {
          isMuted: true,
        });
    },
    [venueId]
  );

  const muteButtonClasses = (isMuted: boolean) =>
    classNames("user__buttons__mute-button", {
      "user__buttons__mute-button--on": isMuted,
    });

  return (
    <div className="admin-panel">
      <div className="people-on-stage">
        <p className="section-label">{peopleOnStage.length} people on stage</p>
        <div>
          {peopleOnStage.map((user) => (
            <div key={user.id} className="user">
              <div className="user-info">
                <div className="user-pic">
                  {user.pictureUrl && (
                    <img src={user.pictureUrl} alt="profile" />
                  )}
                </div>
                {user.partyName || ""}
                {venueId && user.data?.[venueId].isMuted && " (muted)"}
              </div>

              {user.id !== loggedUserId && (
                <div className="user__buttons">
                  <div
                    className="control-user-button"
                    onClick={() => {
                      setUserToRemove(user);
                      showLeaveStageModal();
                    }}
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </div>
                  <div
                    className={
                      venueId &&
                      muteButtonClasses(!!user.data?.[venueId].isMuted)
                    }
                    onClick={() => {
                      muteUser(user.id);
                    }}
                  >
                    <FontAwesomeIcon icon={faVideoSlash} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {screenSharingUser && (
        <div className="screensharing">
          <p className="section-label">Screenshare</p>
          <div key={screenSharingUser.id} className="user">
            <div className="user-info">
              <div className="user-pic">
                {screenSharingUser.pictureUrl && (
                  <img src={screenSharingUser.pictureUrl} alt="profile" />
                )}
              </div>
              {screenSharingUser.partyName || ""} is currently sharing
            </div>

            <Button
              customClass="control-scene-button"
              onClick={() => {
                venueId &&
                  updateUserTalkShowStudioExperience(
                    venueId,
                    screenSharingUser.id,
                    {
                      isSharingScreen: false,
                    }
                  );
              }}
            >
              Stop
            </Button>
          </div>
        </div>
      )}
      <div className="requests">
        {venue.requestToJoinStage ? (
          <>
            <p className="section-label">
              {peopleRequesting.length} Requests to join stage
            </p>
            <div>
              {peopleRequesting.map((user) => (
                <div key={user.id} className="user">
                  <div className="user-info">
                    <div className="user-pic">
                      {user.pictureUrl && (
                        <img src={user.pictureUrl} alt="profile" />
                      )}
                      <div
                        className="user-pic__reaction"
                        role="img"
                        aria-label={requestEmoji.ariaLabel}
                      >
                        {requestEmoji.text}
                      </div>
                    </div>
                    {user.partyName || ""}
                  </div>
                  <div
                    className="control-user-button"
                    onClick={() => {
                      venueId &&
                        updateUserTalkShowStudioExperience(venueId, user.id, {
                          place: PlaceInTalkShowStudioVenue.stage,
                        });
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </div>
                </div>
              ))}
              <Button
                customClass="control-scene-button"
                onClick={() => {
                  venueId &&
                    loggedUser &&
                    updateVenue_v2(
                      {
                        name: venue.name,
                        requestToJoinStage: false,
                      },
                      loggedUser
                    );
                }}
              >
                Stop join requests
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="section-label">Joining stage option is disabled</p>
            <div>
              <Button
                customClass="control-scene-button"
                onClick={() => {
                  venueId &&
                    loggedUser &&
                    updateVenue_v2(
                      {
                        name: venue.name,
                        template: VenueTemplate.talkshowstudio,
                        requestToJoinStage: true,
                      },
                      loggedUser
                    );
                }}
              >
                <span>✋</span> Allow people to request to join
              </Button>
            </div>
          </>
        )}
      </div>
      <LeaveStageModal
        show={isLeaveStageModalVisible}
        onHide={hideLeaveStageModal}
        onSubmit={removeUserFromStage}
        userNameToRemove={userToRemove?.partyName}
      />
    </div>
  );
};

export default AdminPanel;
