import React, { useCallback } from "react";
import { VenueAccessMode } from "types/VenueAcccess";
import { AnyVenue } from "types/venues";
import { getCurrentTimeInUTCSeconds, getTimeBeforeParty } from "utils/time";
import { joinVenue } from "utils/url";
import { SecretPasswordForm } from "../SecretPasswordForm";

interface VenueJoinButtonProps {
  venueId?: string;
  venue: AnyVenue;
  onPasswordSuccess: () => void;
}

export const VenueJoinButton: React.FC<VenueJoinButtonProps> = ({
  venueId,
  venue,
  onPasswordSuccess,
}) => {
  const handleJoinVenue = useCallback(() => {
    joinVenue(venueId, venue?.entrance);
  }, [venue?.entrance, venueId]);

  if (venue.access === VenueAccessMode.Password) {
    return (
      <div className="secret-password-form-wrapper">
        <SecretPasswordForm
          buttonText={
            venue.config?.landingPageConfig.joinButtonText ?? "Join the party"
          }
          onPasswordAccess={onPasswordSuccess}
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
