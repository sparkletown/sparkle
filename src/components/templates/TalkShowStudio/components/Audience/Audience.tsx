import React, { useCallback, useMemo } from "react";
import classNames from "classnames";

import { setGridData } from "api/profile";

import { GridSeatedUser, User } from "types/User";
import { TalkShowStudioVenue } from "types/venues";

// import { makeUpdateUserGridLocation } from "api/profile";
import { WithId } from "utils/id";
import { isDefined } from "utils/types";

import { useGetUserByPosition } from "hooks/useGetUserByPosition";
import { usePartygoersOverlay } from "hooks/usePartygoersOverlay";
// import { setLocationData } from "utils/userLocation";
import { useStage } from "hooks/useStage";
// import { useKeyboardControls } from "hooks/useKeyboardControls";
import { useUser } from "hooks/useUser";

import { useMapGrid } from "components/templates/PartyMap/components/Map/hooks/useMapGrid";

// import { usePartygoersbySeat } from "components/templates/PartyMap/components/Map/hooks/usePartygoersBySeat";
import "./Audience.scss";

export interface AudienceProps {
  venue: WithId<TalkShowStudioVenue>;
}
const TOTAL_COLUMNS = 30;
const TOTAL_ROWS = 8;

export const Audience: React.FC<AudienceProps> = ({ venue }) => {
  const { id: venueId } = venue;
  const { userId, profile } = useUser();
  const recentVenueUsers: WithId<User>[] = venue.recentUsersSample ?? [];
  const { peopleRequesting } = useStage();
  // const { partygoersBySeat } = usePartygoersbySeat({
  //   venueId,
  //   partygoers: recentVenueUsers,
  // });

  const getUsersWithPosition = () => {
    const usersWithPosition: WithId<GridSeatedUser>[] = [];
    return usersWithPosition;
  };

  const getUserBySeat = useGetUserByPosition(getUsersWithPosition());
  //
  const isHidden = isDefined(profile?.data?.[venueId]?.row);

  // @debt it conflicts witht the recent changes. This template is not used by the platform. When have time, remove the comments and fix the issue

  const takeSeat = useCallback(
    (row: number | null, column: number | null) => {
      if (!userId || !row || !column) return;

      setGridData({
        venueId,
        userId,
        gridData: { row, column },
      });

      // setLocationData({ userId: userId, locationName: name });
    },
    [userId, venueId]
  );

  const onSeatClick = useCallback(
    (row: number, column: number) => takeSeat(row, column),
    [takeSeat]
  );

  const columnsArray = useMemo(
    () => Array.from(Array<JSX.Element>(TOTAL_COLUMNS)),
    []
  );
  const rowsArray = useMemo(() => Array.from(Array(TOTAL_ROWS)), []);

  const gridContainerStyles = useMemo(
    () => ({
      gridTemplateColumns: `repeat(${TOTAL_COLUMNS}, calc(100% / ${TOTAL_COLUMNS}))`,
      gridTemplateRows: `repeat(${TOTAL_ROWS}, 1fr)`,
    }),
    []
  );
  // @debt it conflicts witht the recent changes. This template is not used by the platform. When have time, remove the comments and fix the issue

  // useKeyboardControls({
  //   venueId,
  //   totalRows: TOTAL_ROWS,
  //   totalColumns: TOTAL_COLUMNS,
  //   isSeatTaken,
  //   takeSeat,
  // });

  const mapGrid = useMapGrid({
    showGrid: true,
    userUid: userId,
    columnsArray,
    rowsArray,
    getUserBySeat,
    onSeatClick,
  });

  const partygoersOverlay = usePartygoersOverlay({
    showGrid: true,
    userUid: userId,
    venueId,
    withMiniAvatars: venue.miniAvatars,
    rows: TOTAL_ROWS,
    columns: TOTAL_COLUMNS,
    partygoers: recentVenueUsers,
    peopleRequesting,
  });

  const titleStyles = classNames("Screenshare__audience-title", {
    "Screenshare__audience-title--hidden": isHidden,
  });

  return (
    <div className="Screenshare__audience">
      <div className={titleStyles}>Please take a seat!</div>
      <div
        className="Screenshare__audience-container"
        style={gridContainerStyles}
      >
        {mapGrid}
        {partygoersOverlay}
      </div>
    </div>
  );
};
