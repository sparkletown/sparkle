import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { updateUserProfile } from "./helpers";
import "./Account.scss";
import getQueryParameters from "utils/getQueryParameters";
import { RouterLocation } from "types/RouterLocation";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { updateTheme } from "pages/VenuePage/helpers";

interface PropsType {
  location: RouterLocation;
}
export interface CodeOfConductFormData {
  contributeToExperience: string;
  cheerBand: string;
  greatNight: string;
  willingToImprovise: string;
}

export interface CodeOfConductQuestion {
  name: keyof CodeOfConductFormData;
  text: string;
  link?: string;
}

const CodeOfConduct: React.FunctionComponent<PropsType> = ({ location }) => {
  useConnectCurrentVenue();
  const { user, venue } = useSelector((state: any) => ({
    user: state.user,
    venue: state.firestore.data.currentVenue,
  }));
  const { venueId, eventId } = getQueryParameters(location.search);
  const { register, handleSubmit, errors, formState, watch } = useForm<
    CodeOfConductFormData
  >({
    mode: "onChange",
  });
  const onSubmit = async (data: CodeOfConductFormData) => {
    await updateUserProfile(user.uid, data);
    // if we use history.push, the new profile information are not in the redux store
    // when we arrive on `venue/${venueId}/event/${eventId}` and we get redirected again to account/profile
    window.location.assign(
      `/${venueId && eventId ? `venue/${venueId}/event/${eventId}` : ""}`
    );
  };

  if (!venue?.code_of_conduct_questions) {
    return <>Loading...</>;
  }

  venue && updateTheme(venue);

  return (
    <div className="page-container code-of-conduct-container">
      <div className="kansas-smittys-logo"></div>
      <div className="login-container">
        <h2>Final step: agree to our code of conduct</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          {venue.code_of_conduct_questions.map((q: CodeOfConductQuestion) => (
            <div className="input-group" key={q.name}>
              <label
                htmlFor={q.name}
                className={`checkbox ${watch(q.name) && "checkbox-checked"}`}
              >
                {q.link && (
                  <a href={q.link} target="_blank" rel="noopener noreferrer">
                    {q.text}
                  </a>
                )}
                {!q.link && q.text}
              </label>
              <input
                type="checkbox"
                name={q.name}
                id={q.name}
                ref={register({
                  required: true,
                })}
              />
              {errors[q.name]?.type === "required" && (
                <span className="input-error">Required</span>
              )}
            </div>
          ))}

          <input
            className="btn btn-primary btn-block btn-centered"
            type="submit"
            value="Enter the event"
            disabled={!formState.isValid}
          />
        </form>
      </div>
    </div>
  );
};

export default CodeOfConduct;
