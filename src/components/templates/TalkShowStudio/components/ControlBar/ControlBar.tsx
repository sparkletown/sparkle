import React, { FC, useCallback, useMemo } from "react";
import classNames from "classnames";

import { updateTalkShowStudioExperience } from "api/profile";

import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";
import { useShowHide } from "hooks/useShowHide";

import { AppButton } from "components/atoms/Button/Button";

import { ButtonWithLabel } from "components/templates/TalkShowStudio/components/Button/Button";
import { LeaveStageModal } from "components/templates/TalkShowStudio/components/LeaveStageModal";
import { useStage } from "components/templates/TalkShowStudio/useStage";

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

  const onClickShare = useCallback(() => {
    if (venueId && userId) {
      updateTalkShowStudioExperience({
        venueId,
        userId,
        experience: {
          isSharingScreen: !isSharing,
        },
      });
    }
    isSharing ? stopShare() : shareScreen();
  }, [venueId, userId, isSharing, stopShare, shareScreen]);

  const ControlBarClasses = classNames("ControlBar", {
    "ControlBar--one-item": !showSharingControl,
  });

  if (!isUserOnStage) {
    if (canJoinStage && showJoinStageButton) {
      return (
        <div className="JoinStage">
          <AppButton customClass={"JoinStage__button"} onClick={onStageJoin}>
            Join Stage
          </AppButton>
        </div>
      );
    }

    return null;
  }

  return (
    <div className={ControlBarClasses}>
      {showSharingControl && (
        <ButtonWithLabel
          onClick={onClickShare}
          rightLabel={isSharing ? "You are screensharing" : undefined}
          variant="secondary"
          small
          disabled={loading}
        >
          {isSharing ? "Stop Sharing" : "Share Screen"}
        </ButtonWithLabel>
      )}

      <ButtonWithLabel
        onClick={showLeaveStageModal}
        leftLabel="You are on stage"
        variant="secondary"
        small
      >
        Leave Stage
      </ButtonWithLabel>

      <LeaveStageModal
        show={isLeaveStageModalVisible}
        onHide={hideLeaveStageModal}
        onSubmit={onStageLeaving}
      />
    </div>
  );
};
