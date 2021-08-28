import React from "react";
import { useForm } from "react-hook-form";
import { useFirebase } from "react-redux-firebase";

import { VenueAccessMode } from "types/VenueAcccess";

import { venueSelector } from "utils/selectors";

import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useSelector } from "hooks/useSelector";
import { useVenueId } from "hooks/useVenueId";

import { TicketCodeField } from "components/organisms/TicketCodeField";

import { LoadingPage } from "components/molecules/LoadingPage";

import { NotFound } from "components/atoms/NotFound";

import { ButtonRF } from "../ButtonRF";
import { DivRF } from "../DivRF";
import { InputWrapRF } from "../InputWrapRF";
import { SpanRF } from "../SpanRF";

import "./LoginFormRF.scss";

export interface LoginFormRfProps {
  onRegister: () => void;
  onReset: () => void;
  onClose: () => void;
  onFinish?: () => void;
}

interface LoginFormRfData {
  email: string;
  password: string;
  code: string;
  backend?: string;
}

export const LoginFormRF: React.FunctionComponent<LoginFormRfProps> = ({
  onRegister,
  onReset,
  onClose,
  onFinish,
}) => {
  const firebase = useFirebase();

  const {
    clearError,
    errors: { backend, code, email, password },
    formState: { isValid },
    handleSubmit,
    register,
    setError,
  } = useForm<LoginFormRfData>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const venueFromSelector = useSelector(venueSelector);
  const venueId = useVenueId();
  const { currentVenue, isCurrentVenueLoaded } = useConnectCurrentVenueNG(
    venueId
  );
  const venue = venueFromSelector ?? currentVenue;

  if (!venue) {
    return isCurrentVenueLoaded ? <NotFound fullScreen /> : <LoadingPage />;
  }

  const clearBackendErrors = () => {
    clearError("backend");
  };

  const signIn = ({ email, password }: LoginFormRfData) => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  };

  const onSubmit = async (data: LoginFormRfData) => {
    if (!venue) return;
    try {
      await signIn(data);

      onFinish && onFinish();

      onClose();
    } catch (error) {
      if (error.response?.status === 404) {
        setError(
          "email",
          "validation",
          `Email ${data.email} does not have a ticket; get your ticket at ${venue.ticketUrl}`
        );
      } else if (error.response?.status >= 500) {
        setError(
          "email",
          "validation",
          `Error checking ticket: ${error.message}`
        );
      } else {
        setError("backend", "firebase", error.message);
      }
    }
  };

  return (
    <DivRF className="LoginFormRF mod--flex-col">
      <DivRF variant="title">Welcome back</DivRF>
      <DivRF>Please log in to get back to the playa.</DivRF>

      <form
        onSubmit={handleSubmit(onSubmit)}
        onChange={clearBackendErrors}
        className="mod--flex-col"
      >
        <InputWrapRF
          required={email?.type === "required" && "Email is required"}
          error={
            (email?.type === "firebase" || email?.type === "validation") && (
              <span className="input-error">{email?.message}</span>
            )
          }
        >
          <input
            name="email"
            placeholder="Your email"
            ref={register({ required: true })}
          />
        </InputWrapRF>
        <InputWrapRF
          required={password?.type === "required" && "Password is required"}
        >
          <input
            name="password"
            type="password"
            placeholder="Password"
            ref={register({
              required: true,
            })}
          />
          <ButtonRF className="LoginFormRF__forgot" isLink onClick={onReset}>
            Forgot my password
          </ButtonRF>
        </InputWrapRF>

        {venue.access === VenueAccessMode.Codes && (
          <TicketCodeField register={register} error={code} />
        )}

        <SpanRF variant="error">{backend?.message}</SpanRF>

        <ButtonRF type="submit" disabled={!isValid} variant="primary">
          Log in
        </ButtonRF>
      </form>

      <DivRF>
        Don&apos;t have an account?
        <br />
        <ButtonRF className="LoginFormRF__register" isLink onClick={onRegister}>
          Register
        </ButtonRF>
      </DivRF>
    </DivRF>
  );
};
