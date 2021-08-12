import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

import { PLAYA_IMAGE, PLAYA_VENUE_NAME } from "settings";

import { useUser } from "hooks/useUser";

import "firebase/storage";

import "./Account.scss";

interface CodeOfConductFormData {
  contributeToExperience: string;
  cheerBand: string;
  greatNight: string;
  willingToImprovise: string;
  commonDecency: string;
  tenPrinciples: string;
  termsAndConditions: string;
}

interface PrincipleDefinition {
  name: string;
  text: string;
}

export const TEN_PRINCIPLES_LIST: PrincipleDefinition[] = [
  {
    name: "Radical Inclusion",
    text:
      "Anyone may be a part of Burning Man. We welcome and respect the stranger. No prerequisites exist for participation in our community.",
  },
  {
    name: "Gifting",
    text:
      "Burning Man is devoted to acts of gift giving. The value of a gift is unconditional. Gifting does not contemplate a return or an exchange for something of equal value.",
  },
  {
    name: "Decommodification",
    text:
      "In order to preserve the spirit of gifting, our community seeks to create social environments that are unmediated by commercial sponsorships, transactions, or advertising. We stand ready to protect our culture from such exploitation. We resist the substitution of consumption for participatory experience.",
  },
  {
    name: "Radical Self-reliance",
    text:
      "Burning Man encourages the individual to discover, exercise and rely on his or her inner resources.",
  },
  {
    name: "Radical Self-expression",
    text:
      "Radical self-expression arises from the unique gifts of the individual. No one other than the individual or a collaborating group can determine its content. It is offered as a gift to others. In this spirit, the giver should respect the rights and liberties of the recipient.",
  },
  {
    name: "Communal Effort",
    text:
      "Our community values creative cooperation and collaboration. We strive to produce, promote and protect social networks, public spaces, works of art, and methods of communication that support such interaction.",
  },
  {
    name: "Civic Responsibility",
    text:
      "We value civil society. Community members who organize events should assume responsibility for public welfare and endeavor to communicate civic responsibilities to participants. They must also assume responsibility for conducting events in accordance with local, state and federal laws.",
  },
  {
    name: "Leaving No Trace",
    text:
      "Our community respects the environment. We are committed to leaving no physical trace of our activities wherever we gather. We clean up after ourselves and endeavor, whenever possible, to leave such places in a better state than when we found them.",
  },
  {
    name: "Participation",
    text:
      "Our community is committed to a radically participatory ethic. We believe that transformative change, whether in the individual or in society, can occur only through the medium of deeply personal participation. We achieve being through doing. Everyone is invited to work. Everyone is invited to play. We make the world real through actions that open the heart.",
  },
  {
    name: "Immediacy",
    text:
      "Immediate experience is, in many ways, the most important touchstone of value in our culture. We seek to overcome barriers that stand between us and a recognition of our inner selves, the reality of those around us, participation in society, and contact with a natural world exceeding human powers. No idea can substitute for this experience.",
  },
];

const Step3 = () => {
  const { user } = useUser();
  const history = useHistory();
  const {
    register,
    handleSubmit,
    errors,
    formState,
    watch,
  } = useForm<CodeOfConductFormData>({
    mode: "onChange",
  });

  const onSubmit = async (data: CodeOfConductFormData) => {
    if (!user) return;
    history.push(`/enter/step4`);
  };

  return (
    <div className="splash-page-container">
      <img
        className="playa-img"
        src={PLAYA_IMAGE}
        alt={`${PLAYA_VENUE_NAME} Background Map`}
      />
      <div className="step-container ten-principles-burning">
        <div className="login-container">
          <h2>The 10 principles of Burning Man</h2>
          <p>{`They are the community's ethos and culture as it had organically developed since the event's inception. Please read and check them`}</p>
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            {TEN_PRINCIPLES_LIST.map((q) => (
              <div className="input-group" key={q.name}>
                <label
                  htmlFor={q.name}
                  className={`checkbox ${watch(q.name) && "checkbox-checked"}`}
                >
                  <div className="principle-name">{q.name}</div>
                  <div className="principle-description">{q.text}</div>
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
    </div>
  );
};

export default Step3;
