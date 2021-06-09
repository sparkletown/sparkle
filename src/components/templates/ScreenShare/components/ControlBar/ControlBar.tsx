import React, { FC, useMemo } from "react";
import classNames from "classnames";
import Button from "../Button/Button";
import { updateScreenShareStatus } from "../../../../../api/profile";
import useStage from "../../useStage";
import { useVenueId } from "../../../../../hooks/useVenueId";
import { useUser } from "../../../../../hooks/useUser";
import LeaveStageModal from "../LeaveStageModal/LeaveStageModal";
import { useShowHide } from "../../../../../hooks/useShowHide";
import "./ControlBar.scss";

export interface ControlBarProps {
  isSharing: boolean;
  stopShare: () => void;
  shareScreen: () => void;
  onStageLeaving: () => void;
  onStageJoin: () => void;
  loading?: boolean;
  showJoinStageButton?: boolean;
}

export const ControlBar: FC<ControlBarProps> = ({
  isSharing,
  stopShare,
  shareScreen,
  onStageLeaving,
  onStageJoin,
  loading = false,
  showJoinStageButton = false,
}) => {
  const venueId = useVenueId();
  const { userId } = useUser();
  const { isUserOnStage, canJoinStage, canShareScreen } = useStage();

  const {
    isShown: isLeaveStageModalVisible,
    show: showLeaveStageModal,
    hide: hideLeaveStageModal,
  } = useShowHide();

  const showSharingControl = useMemo(() => canShareScreen || isSharing, [
    canShareScreen,
    isSharing,
  ]);

  const ControlBarClasses = classNames("ControlBar", {
    "ControlBar--one-item": !showSharingControl,
  });

  if (!isUserOnStage && canJoinStage && showJoinStageButton)
    return (
      <div className="JoinStage">
        <Button onClick={onStageJoin} variant="secondary" small>
          Join Stage
        </Button>
      </div>
    );

  return isUserOnStage ? (
    <div className={ControlBarClasses}>
      {showSharingControl && (
        <Button
          onClick={() => {
            venueId &&
              userId &&
              updateScreenShareStatus({
                venueId,
                userId,
                isSharingScreen: !isSharing,
              });
            isSharing ? stopShare() : shareScreen();
          }}
          rightLabel={isSharing ? "You are screensharing" : undefined}
          variant="secondary"
          small
          disabled={loading}
        >
          {isSharing ? "Stop Sharing" : "Share Screen"}
        </Button>
      )}

      <Button
        onClick={() => {
          showLeaveStageModal();
        }}
        leftLabel="You are on stage"
        variant="secondary"
        small
      >
        Leave Stage
      </Button>

      <LeaveStageModal
        show={isLeaveStageModalVisible}
        onHide={() => {
          hideLeaveStageModal();
        }}
        onSubmit={onStageLeaving}
      />
    </div>
  ) : null;
};
