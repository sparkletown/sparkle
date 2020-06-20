import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { updateUserProfile } from "./helpers";
import "./Account.scss";

export interface CodeOfConductFormData {
  seekFun: string;
  addFun: string;
  wearCostume: string;
  respectParty: string;
  partyReal: string;
}

const QUESTIONS: {
  id: keyof CodeOfConductFormData;
  label: string;
  link?: string;
}[] = [
  {
    id: "seekFun",
    label: "I will seek out the fun",
  },
  {
    id: "addFun",
    label: "I will add to the fun",
  },
  {
    id: "wearCostume",
    label: "I will wear a costume where possible",
  },
  {
    id: "respectParty",
    label:
      "I will respect my fellow party-goers’ feelings and boundaries by obeying the Consent Policy",
    link: "https://co-reality.co/consent-policy/",
  },
  {
    id: "partyReal",
    label: "I understand those parties are real",
  },
];

const CodeOfConduct = () => {
  const history = useHistory();
  const { user } = useSelector((state: any) => ({
    user: state.user,
  }));
  const { register, handleSubmit, errors, formState, watch } = useForm<
    CodeOfConductFormData
  >({
    mode: "onChange",
  });
  const onSubmit = async (data: CodeOfConductFormData) => {
    await updateUserProfile(user.uid, data);
    history.push("/");
  };

  return (
    <div className="page-container">
      <div className="coreality-logo-sparkles"></div>
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
                  <a href={q.link} target="_blank">
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
