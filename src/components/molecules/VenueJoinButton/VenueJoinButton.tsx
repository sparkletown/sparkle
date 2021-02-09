import React, { useCallback } from "react";
import { VenueAccessMode } from "types/VenueAcccess";
import { AnyVenue } from "types/venues";
import { getCurrentTimeInUTCSeconds, getTimeBeforeParty } from "utils/time";
import { joinVenue } from "utils/url";
import { SecretPasswordForm } from "../SecretPasswordForm";

interface VenueJoinButtonProps {
  venueId?: string;
  venue: AnyVenue;
  onPasswordSubmit: () => void;
  onPasswordSuccess: () => void;
}

export const VenueJoinButton: React.FC<VenueJoinButtonProps> = ({
  venueId,
  venue,
  onPasswordSubmit,
  onPasswordSuccess,
}) => {
  const handleJoinVenue = useCallback(() => {
    joinVenue(venueId, !!venue?.entrance?.length);
  }, [venue, venueId]);

  // @debt Handle emails and codes as well.
  if (venue.access === VenueAccessMode.Password) {
    return (
      <div className="secret-password-form-wrapper">
        <SecretPasswordForm
          buttonText={
            venue.config?.landingPageConfig.joinButtonText ?? "Join the party"
          }
          onPasswordSubmit={onPasswordSubmit}
          onPasswordSuccess={onPasswordSuccess}
        />
      </div>
    );
  }

  return (
    <button
      className="btn btn-primary btn-block btn-centered"
      onClick={handleJoinVenue}
    >
      Join the event
      {(venue?.start_utc_seconds ?? 0) > getCurrentTimeInUTCSeconds() && (
        <span className="countdown">
          Begins in {getTimeBeforeParty(venue?.start_utc_seconds)}
        </span>
      )}
    </button>
  );
};
