import React from "react";
import { useForm } from "react-hook-form";
import { updateUserProfile } from "./helpers";
import "./Account.scss";
import getQueryParameters from "utils/getQueryParameters";
import { RouterLocation } from "types/RouterLocation";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { updateTheme } from "pages/VenuePage/helpers";
import { useUser } from "hooks/useUser";
import { useHistory } from "react-router-dom";
import { useSelector } from "hooks/useSelector";
import { venueInsideUrl } from "utils/url";

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

  const { user } = useUser();
  const { venue } = useSelector((state) => ({
    venue: state.firestore.data.currentVenue,
  }));
  const history = useHistory();
  const { venueId } = getQueryParameters(location.search);
  const { register, handleSubmit, errors, formState, watch } = useForm<
    CodeOfConductFormData
  >({
    mode: "onChange",
  });
  const onSubmit = async (data: CodeOfConductFormData) => {
    if (!user) return;
    await updateUserProfile(user.uid, data);
    history.push(venueId ? venueInsideUrl(venueId.toString()) : "");
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
          {venue.code_of_conduct_questions.map((q) => (
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
              {/* @ts-ignore @debt questions should be typed if possible */}
              {q.name in errors && errors[q.name].type === "required" && (
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
