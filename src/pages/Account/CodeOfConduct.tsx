import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { updateUserProfile } from "./helpers";
import "./Account.scss";
import getQueryParameters from "utils/getQueryParameters";
import { RouterLocation } from "types/RouterLocation";

interface PropsType {
  location: RouterLocation;
}
export interface CodeOfConductFormData {
  contributeToExperience: string;
  cheerBand: string;
  greatNight: string;
  willingToImprovise: string;
}

const QUESTIONS: {
  id: keyof CodeOfConductFormData;
  label: string;
  link?: string;
}[] = [
  {
    id: "contributeToExperience",
    label: "I agree to contribute to the experience.",
  },
  {
    id: "cheerBand",
    label:
      "I understand I can cheer the band live using the buttons under the video.",
  },
  {
    id: "greatNight",
    label: "I will have a great night out.",
  },
  {
    id: "willingToImprovise",
    label: "I realise this is jazz and i'm willing to improvise.",
  },
];

const CodeOfConduct: React.FunctionComponent<PropsType> = ({ location }) => {
  const history = useHistory();
  const { user } = useSelector((state: any) => ({
    user: state.user,
  }));
  const { venueId } = getQueryParameters(location.search);
  const { register, handleSubmit, errors, formState, watch } = useForm<
    CodeOfConductFormData
  >({
    mode: "onChange",
  });
  const onSubmit = async (data: CodeOfConductFormData) => {
    await updateUserProfile(user.uid, data);
    history.push(`/${venueId ? `venue/${venueId}${location.search}` : ""}`);
  };

  return (
    <div className="page-container code-of-conduct-container">
      <div className="kansas-smittys-logo"></div>
      <div className="login-container">
        <h2>Final step: agree to our code of conduct</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          {QUESTIONS.map((q) => (
            <div className="input-group" key={q.id}>
              <label
                htmlFor={q.id}
                className={`checkbox ${watch(q.id) && "checkbox-checked"}`}
              >
                {q.link && (
                  <a href={q.link} target="_blank" rel="noopener noreferrer">
                    {q.label}
                  </a>
                )}
                {!q.link && q.label}
              </label>
              <input
                type="checkbox"
                name={q.id}
                id={q.id}
                ref={register({
                  required: true,
                })}
              />
              {errors[q.id]?.type === "required" && (
                <span className="input-error">Required</span>
              )}
            </div>
          ))}

          <input
            className="btn btn-primary btn-block btn-centered"
            type="submit"
            value="Enter the bar"
            disabled={!formState.isValid}
          />
        </form>
      </div>
    </div>
  );
};

export default CodeOfConduct;
