import React, { ChangeEventHandler, useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { get } from "lodash/fp";

import { ATTENDEE_STEPPING_PARAM_URL, DEFAULT_ENTER_STEP } from "settings";

import { checkAccess } from "api/auth";

import { setLocalStorageToken } from "utils/localStorage";
import { isDefined, isTruthy } from "utils/types";
import { generateUrl } from "utils/url";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";

import "./SecretPasswordForm.scss";

export const SecretPasswordForm = ({ buttonText = "Join the party" }) => {
  const history = useHistory();
  const { spaceId, worldSlug, spaceSlug } = useWorldAndSpaceByParams();

  const [error, setError] = useState(false);
  const [password, setPassword] = useState<string>();
  const [message, setMessage] = useState<string>();

  const passwordChanged: ChangeEventHandler<HTMLInputElement> = (e) => {
    setPassword(e.target.value);

    if (message !== "") {
      setMessage("");
    }

    if (error) {
      setError(false);
    }
  };

  // @debt replace this with useAsync / useAsyncFn
  const passwordSubmitted = useCallback(
    async (e) => {
      e.preventDefault();

      if (!isDefined(spaceId)) {
        setMessage("Missing venueId");
        setError(true);
        return;
      }

      if (!isDefined(spaceSlug)) {
        setMessage("Missing spaceSlug");
        setError(true);
        return;
      }

      setMessage("Checking password...");

      await checkAccess({
        venueId: spaceId,
        password,
      })
        .then((result) => {
          const token = get("token", result?.data);
          if (isTruthy(token)) {
            setLocalStorageToken(spaceId, token);
            history.push(
              generateUrl({
                route: ATTENDEE_STEPPING_PARAM_URL,
                required: ["worldSlug", "spaceSlug", "step"],
                params: { worldSlug, spaceSlug, step: DEFAULT_ENTER_STEP },
              })
            );
          } else {
            setMessage(`Wrong password!`);
            setError(true);
          }
        })
        .catch((err) => {
          setMessage(`Password error: ${err.toString()}`);
          setError(true);
        });
    },
    [history, password, worldSlug, spaceSlug, spaceId]
  );

  return (
    <>
      <form className="secret-password-form" onSubmit={passwordSubmitted}>
        <p className="small-text">
          Got an invite? Join in with the secret password
        </p>
        <input
          className="secret-password-input"
          required
          placeholder="password"
          autoFocus
          onChange={passwordChanged}
          id="password"
        />
        <input
          className="btn btn-primary btn-block btn-centered"
          type="submit"
          value={buttonText}
        />
        <div className="form-group">
          {message && <small>{message}</small>}
          {error && <small className="error-message">An error occured</small>}
        </div>
      </form>
    </>
  );
};
