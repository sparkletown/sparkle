import React, { useCallback, useState } from "react";

import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";

import {
  DEFAULT_PARTY_BUTTON_TEXT,
  DEFAULT_PARTY_JOIN_MESSAGE,
} from "settings";

import { checkAccess } from "api/auth";

import { AnyVenue } from "types/venues";

import { useUser } from "hooks/useUser";

import { getCurrentTimeInUTCSeconds, getTimeBeforeParty } from "utils/time";
import { setLocalStorageToken } from "utils/localStorage";
import { isTruthy } from "utils/types";
import { joinVenue } from "utils/url";

import "./VenueJoinButton.scss";

export interface VenueJoinButtonProps {
  venueId?: string;
  venue: AnyVenue;
  onPasswordSubmit?: () => void;
}

export interface VenueJoinButtonData {
  password: string;
}

export const VenueJoinButton: React.FC<VenueJoinButtonProps> = ({
  venueId,
  venue,
  onPasswordSubmit,
}) => {
  const { user } = useUser();
  const [message, setMessage] = useState("");
  const [isJoinVenueModalOpen, setJoinVenueModalOpen] = useState(false);

  const isLoggedIn = !!user;
  const buttonText =
    venue.config?.landingPageConfig.joinButtonText ?? DEFAULT_PARTY_BUTTON_TEXT;

  const {
    register,
    handleSubmit,
    errors,
    setError,
    clearError,
  } = useForm<VenueJoinButtonData>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const showJoinVenueModal = useCallback(() => {
    setJoinVenueModalOpen(true);
  }, []);

  const hideJoinVenueModal = useCallback(() => {
    setJoinVenueModalOpen(false);
  }, []);

  const handleJoinVenue = useCallback(() => {
    if (!venueId) return;

    joinVenue(venueId, { hasVenueEntrance: !!venue.entrance?.length });
  }, [venue, venueId]);

  const changePassword = useCallback(() => {
    setMessage("");
    clearError();
  }, [clearError]);

  const submitPassword = useCallback(
    async ({ password }) => {
      if (!venueId) return;

      if (!venue.access) {
        handleJoinVenue();
        return;
      }

      setMessage("Checking password...");
      onPasswordSubmit && onPasswordSubmit();

      if (!user) {
        setMessage("");
        return;
      }

      await checkAccess({
        venueId,
        password,
      })
        .then((result) => {
          if (isTruthy(result?.data?.token)) {
            setLocalStorageToken(venueId, result.data.token);
            showJoinVenueModal();
            setMessage("Success!");
          } else {
            setMessage("");
            setError("password", "required", `Wrong password!`);
          }
        })
        .catch((error) => {
          setMessage(`Password error: ${error.toString()}`);
        });
    },
    [
      handleJoinVenue,
      onPasswordSubmit,
      setError,
      showJoinVenueModal,
      user,
      venue.access,
      venueId,
    ]
  );

  return (
    <>
      <div className="secret-password-form-wrapper">
        <form
          className="secret-password-form"
          onSubmit={handleSubmit(submitPassword)}
        >
          {venue.access && (
            <>
              <p className="small-text">
                Got an invite? Join in with the secret password
              </p>
              <input
                className="secret-password-input"
                name="password"
                ref={register({ required: true })}
                placeholder="password"
                autoFocus
                onChange={changePassword}
                id="password"
              />
            </>
          )}
          <button
            className="btn btn-primary btn-block btn-centered"
            type="submit"
          >
            {buttonText}
            {(venue.start_utc_seconds ?? 0) > getCurrentTimeInUTCSeconds() && (
              <span className="countdown">
                Begins in {getTimeBeforeParty(venue.start_utc_seconds)}
              </span>
            )}
          </button>
          <div className="form-group">{message}</div>
          {errors.password && errors.password.type === "required" && (
            <span className="input-error">Password is required</span>
          )}
        </form>
      </div>
      <Modal show={isJoinVenueModalOpen} onHide={hideJoinVenueModal}>
        <Modal.Body>
          <div className="venue-join-modal__title">
            {isLoggedIn
              ? `You are now attending ${venue.name}`
              : DEFAULT_PARTY_JOIN_MESSAGE}
          </div>
          <button
            className="btn btn-primary btn-block btn-centered"
            onClick={handleJoinVenue}
          >
            {`Let's go`}
          </button>
        </Modal.Body>
      </Modal>
    </>
  );
};
