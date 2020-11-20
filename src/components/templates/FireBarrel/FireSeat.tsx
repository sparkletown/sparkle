import React, { useState } from "react";

import { useSelector } from "hooks/useSelector";

import VideoErrorModal from "components/organisms/Room/VideoErrorModal";
import LocalParticipant from "components/organisms/Room/LocalParticipant";

import * as S from "./FireBarrel.styled";
import { BarrelPeple } from "./FireBarrel";
import { useUser } from "hooks/useUser";
import { useVideoState } from "./useVideo";

interface FireSeatProps {
  person: BarrelPeple;
  chairNumber: number;
  roomName?: string;
}

const FireSeat: React.FC<FireSeatProps> = ({
  person,
  chairNumber,
  roomName,
}) => {
  const { user } = useUser();
  const { room } = useVideoState({ userUid: user?.uid, roomName });

  const [videoError, setVideoError] = useState<string>("");

  const users = useSelector((state) => state.firestore.data.partygoers);
  const profileData = room ? users[room.localParticipant.identity] : undefined;

  return (
    <S.Chair isEmpty={false}>
      {user && room && profileData && (
        <LocalParticipant
          participant={room?.localParticipant}
          profileData={profileData}
          profileDataId={room?.localParticipant.identity}
          showIcon={false}
        />
      )}
      <VideoErrorModal
        show={!!videoError}
        onHide={() => setVideoError("")}
        errorMessage={videoError}
        // onRetry={connectToVideoRoom}
        onRetry={() => {}}
        onBack={() => {}}
        // onBack={() => (setSeatedAtTable ? leaveSeat() : setVideoError(""))}
      />
    </S.Chair>
  );
};

export default FireSeat;
