import React from "react";
import { LocalParticipant, RemoteParticipant } from "twilio-video";

import * as S from "./FireBarrel.styled";
// import { BarrelPeple } from "./FireBarrel";

interface FireSeatProps {
  participant: LocalParticipant | RemoteParticipant;
  // person: BarrelPeple;
  // chairNumber: number;
  // roomName?: string;
}

// TODO: potentially don't even need this anymore, can delete maybe if you want? I inlined the only relevant looking bits from here
const FireSeat: React.FC<FireSeatProps> = (
  {
    // person,
    // chairNumber,
    // roomName,
  }
) => {
  return (
    <S.Chair isEmpty={false}>
      {
        // <LocalParticipant
        //   participant={localParticipant}
        //   profileData={profileData}
        //   profileDataId={room?.localParticipant.identity}
        //   showIcon={false}
        // />
      }
      {/*<VideoErrorModal*/}
      {/*  show={!!videoError}*/}
      {/*  onHide={() => setVideoError("")}*/}
      {/*  errorMessage={videoError}*/}
      {/*  // onRetry={connectToVideoRoom}*/}
      {/*  onRetry={() => {}}*/}
      {/*  onBack={() => {}}*/}
      {/*  // onBack={() => (setSeatedAtTable ? leaveSeat() : setVideoError(""))}*/}
      {/*/>*/}
    </S.Chair>
  );
};

export default FireSeat;
