import React, { FC } from "react";
import "./AdminPanel.scss";
import useStage from "../../../../useStage";
import Button from "../../../../../../atoms/Button";
import { useVenueId } from "../../../../../../../hooks/useVenueId";
import {
  changeUserPlaceInVenue,
  updateVenue_v2,
} from "../../../../../../../api/admin";
import { useUser } from "../../../../../../../hooks/useUser";
import {
  FullTalkShowVenue,
  VenueTemplate,
} from "../../../../../../../types/venues";
import { WithId } from "../../../../../../../utils/id";
import { PlaceInFullTalkShowVenue } from "../../../../../../../types/User";

export interface AdminPanelProps {
  venue: WithId<FullTalkShowVenue>;
}

const AdminPanel: FC<AdminPanelProps> = ({ venue }) => {
  const venueId = useVenueId();
  const { user: loggedUser } = useUser();
  const { peopleOnStage, peopleRequesting } = useStage();

  return (
    <div className="admin-panel">
      <div className="people-on-stage">
        <p className="section-label">{peopleOnStage.length} people on stage</p>
        <div>
          {peopleOnStage.map((user) => (
            <div key={user.id} className="user">
              <div className="user-pic">
                {user.pictureUrl && <img src={user.pictureUrl} alt="profile" />}
              </div>
              {user.partyName || ""}
              <div
                className="add-requester-button"
                onClick={() => {
                  venueId &&
                    changeUserPlaceInVenue(
                      venueId,
                      user.id,
                      PlaceInFullTalkShowVenue.audience
                    );
                }}
              >
                -
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="requests">
        {venue.requestToJoinStage ? (
          <>
            <p className="section-label">
              {peopleRequesting.length} Requests to join stage
            </p>
            <div>
              {peopleRequesting.map((user) => (
                <div key={user.id} className="user">
                  <div className="user-pic">
                    {user.pictureUrl && (
                      <img src={user.pictureUrl} alt="profile" />
                    )}
                  </div>
                  {user.partyName || ""}
                  <div
                    className="add-requester-button"
                    onClick={() => {
                      venueId &&
                        changeUserPlaceInVenue(
                          venueId,
                          user.id,
                          PlaceInFullTalkShowVenue.stage
                        );
                    }}
                  >
                    +
                  </div>
                </div>
              ))}
              <Button
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
                  // set all requesters as audience
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
                onClick={() => {
                  venueId &&
                    loggedUser &&
                    updateVenue_v2(
                      {
                        name: venue.name,
                        template: VenueTemplate.screenshare,
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
    </div>
  );
};

export default AdminPanel;
