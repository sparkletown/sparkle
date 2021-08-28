import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import firebase from "firebase/app";

import { SPARKLE_TERMS_AND_CONDITIONS_URL } from "settings";

import { checkIsEmailWhitelisted } from "api/auth";

import { VenueAccessMode } from "types/VenueAcccess";

import { venueSelector } from "utils/selectors";

import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useSelector } from "hooks/useSelector";
import { useVenueId } from "hooks/useVenueId";

import { updateUserPrivate } from "pages/Account/helpers";

import { DateOfBirthField } from "components/organisms/DateOfBirthField";
import { TicketCodeField } from "components/organisms/TicketCodeField";

import { LoadingPage } from "components/molecules/LoadingPage";

import { NotFound } from "components/atoms/NotFound";

import { ButtonRF } from "../ButtonRF";
import { CheckboxWrapRF } from "../CheckboxWrapRF";
import { ConfirmationModalRF } from "../ConfirmationModalRF";
import { DivRF } from "../DivRF";
import { InputWrapRF } from "../InputWrapRF";
import { SpanRF } from "../SpanRF";

import "./RegisterFormRF.scss";

export interface RegisterFormRfProps {
  onLogin: () => void;
  onReset: () => void;
  onFinish?: () => void;
  onClose: () => void;
}

export interface RegisterFormRfData {
  email: string;
  password: string;
  code: string;
  date_of_birth: string;
  backend?: string;
}

export interface RegisterData {
  date_of_birth: string;
}

const sparkleTermsAndConditions = {
  name: `I agree to Sparkle's terms and conditions`,
  text: `I agree to Sparkle's terms and conditions`,
  link: SPARKLE_TERMS_AND_CONDITIONS_URL,
};

export const RegisterFormRF: React.FunctionComponent<RegisterFormRfProps> = ({
  onLogin,
  onReset,
  onFinish,
  onClose,
}) => {
  const history = useHistory();
  const venueFromSelector = useSelector(venueSelector);
  const venueId = useVenueId();
  const { currentVenue, isCurrentVenueLoaded } = useConnectCurrentVenueNG(
    venueId
  );
  const venue = venueFromSelector ?? currentVenue;

  const [showLoginModal, setShowLoginModal] = useState(false);

  const signUp = ({ email, password }: RegisterFormRfData) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  };

  const {
    register,
    handleSubmit,
    errors,
    formState,
    setError,
    clearError,
    // watch,
    getValues,
  } = useForm<RegisterFormRfData & Record<string, string>>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const clearBackendErrors = () => {
    clearError("backend");
  };

  if (!venue) {
    return isCurrentVenueLoaded ? <NotFound fullScreen /> : <LoadingPage />;
  }

  const onSubmit = async (data: RegisterFormRfData) => {
    try {
      setShowLoginModal(false);

      if (venue.access === VenueAccessMode.Emails) {
        const isEmailWhitelisted = await checkIsEmailWhitelisted({
          venueId: venue.id,
          email: data.email,
        });

        if (!isEmailWhitelisted.data) {
          setError(
            "email",
            "validation",
            "We can't find you! Please use the email from your invitation."
          );
          return;
        }
      }

      const auth = await signUp(data);

      if (auth.user && venue.requiresDateOfBirth) {
        updateUserPrivate(auth.user.uid, {
          date_of_birth: data.date_of_birth,
        }).catch((e) => console.warn(RegisterFormRF.name, "error:", e));
      }

      onFinish?.();
      onClose();
      history.push(`/account/profile${venue.id ? `?venueId=${venue.id}` : ""}`);
    } catch ({ code, message, response }) {
      if (code === "auth/email-already-in-use") {
        setShowLoginModal(true);
      }
      if (response?.status === 404) {
        setError(
          "email",
          "validation",
          `Email ${data.email} does not have a ticket; get your ticket at ${venue.ticketUrl}`
        );
      } else if (response?.status >= 500) {
        setError("email", "validation", `Error checking ticket: ${message}`);
      } else {
        setError("backend", "firebase", message);
      }
    }
  };

  const signIn = async () => {
    const { email, password } = getValues();
    await firebase.auth().signInWithEmailAndPassword(email, password);
  };

  return (
    <DivRF className="RegisterFormRF mod--flex-col">
      {showLoginModal && (
        <ConfirmationModalRF
          title="This account already exists."
          message="Would you like to login with the same credentials?"
          onConfirm={signIn}
        />
      )}

      <DivRF variant="title">Create your account</DivRF>
      <DivRF variant="subtitle">
        This will give you access to all sorts of Sparkly things...
        <br />
        Please ensure you use the email associated with your ticket.
      </DivRF>

      <form
        onSubmit={handleSubmit(onSubmit)}
        onChange={clearBackendErrors}
        className="RegisterFormRF__form mod--flex-col"
      >
        <InputWrapRF
          required={errors?.email?.type === "required" && "Email is required"}
          error={
            (errors?.email?.type === "firebase" ||
              errors?.email?.type === "validation") &&
            errors?.email?.message
          }
        >
          <input
            name="email"
            placeholder="Your email"
            ref={register({ required: true })}
          />
        </InputWrapRF>

        <InputWrapRF
          className="RegisterFormRF__password"
          info={
            errors?.password?.type !== "pattern" &&
            "Password must contain letters, numbers, and be at least 6 characters long"
          }
          required={
            errors?.password?.type === "pattern" &&
            "Password must contain letters, numbers, and be at least 6 characters long"
          }
          error={
            errors?.password?.type === "required" && "Password is required"
          }
        >
          <input
            name="password"
            type="password"
            placeholder="Password"
            ref={register({
              required: true,
              pattern: /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,}$/,
            })}
          />
        </InputWrapRF>

        {venue.access === VenueAccessMode.Codes && (
          <TicketCodeField register={register} error={errors?.code} />
        )}

        {venue.requiresDateOfBirth && (
          <DateOfBirthField register={register} error={errors?.date_of_birth} />
        )}

        <SpanRF variant="error">{errors?.backend?.message}</SpanRF>

        <CheckboxWrapRF
          isExternal
          link={sparkleTermsAndConditions.link}
          label={sparkleTermsAndConditions.text}
          error={
            errors?.[sparkleTermsAndConditions.name]?.type === "required" &&
            "Required"
          }
        >
          <input
            name={sparkleTermsAndConditions.name}
            ref={register({
              required: true,
            })}
            type="checkbox"
          />
        </CheckboxWrapRF>

        {venue.termsAndConditions?.map(({ link, name, text }) => (
          <CheckboxWrapRF
            key={name}
            isExternal
            link={link}
            label={text}
            error={errors?.[name]?.type === "required" && "Required"}
          >
            <input
              name={name}
              ref={register({
                required: true,
              })}
              type="checkbox"
            />
          </CheckboxWrapRF>
        ))}
        <ButtonRF type="submit" disabled={!formState.isValid} variant="primary">
          Create account
        </ButtonRF>
      </form>

      <div className="secondary-action">
        Already have an account?
        <br />
        <ButtonRF className="LoginFormRF__login" isLink onClick={onLogin}>
          Login
        </ButtonRF>
      </div>
    </DivRF>
  );
};
