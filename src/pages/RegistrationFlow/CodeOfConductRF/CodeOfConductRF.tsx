import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useAsyncFn, useSearchParam } from "react-use";

import { isTruthy } from "utils/types";
import { venueInsideUrl } from "utils/url";

import { useUser } from "hooks/useUser";
import { useVenueId } from "hooks/useVenueId";

import { CodeOfConductFormData } from "pages/Account/CodeOfConduct";
import { updateUserProfile } from "pages/Account/helpers";
import { SpanRF } from "pages/RegistrationFlow/SpanRF";

import { Loading } from "components/molecules/Loading";

import { ButtonNG } from "components/atoms/ButtonNG";
import { NotFound } from "components/atoms/NotFound";

import { CheckboxWrapRF } from "../CheckboxWrapRF";
import { DivRF } from "../DivRF";
import { PaneRF } from "../PaneRF";

import "./CodeOfConductRF.scss";

const TEN_PRINCIPLES_OF_BURNING_MAN = [
  "Anyone may be a part of Burning Man. We welcome and respect the stranger. No prerequisites exist for participation in our community.",
  "Burning Man is devoted to acts of gift giving. The value of a gift is unconditional. Gifting does not contemplate a return or an exchange for something of equal value.",
  "In order to preserve the spirit of gifting, our community seeks to create social environments that are unmediated by commercial sponsorships, transactions, or advertising. We stand ready to protect our culture from such exploitation. We resist the substitution of consumption for participatory experience.",
  "Burning Man encourages the individual to discover, exercise and rely on his or her inner resources.",
  "Radical self-expression arises from the unique gifts of the individual. No one other than the individual or a collaborating group can determine its content. It is offered as a gift to others. In this spirit, the giver should respect the rights and liberties of the recipient.",
  "Our community values creative cooperation and collaboration. We strive to produce, promote and protect social networks, public spaces, works of art, and methods of communication that support such interaction.",
  "We value civil society. Community members who organize events should assume responsibility for public welfare and endeavor to communicate civic responsibilities to participants. They must also assume responsibility for conducting events in accordance with local, state and federal laws.",
  "Our community respects the environment. We are committed to leaving no physical trace of our activities wherever we gather. We clean up after ourselves and endeavor, whenever possible, to leave such places in a better state than when we found them.",
  "Our community is committed to a radically participatory ethic. We believe that transformative change, whether in the individual or in society, can occur only through the medium of deeply personal participation. We achieve being through doing. Everyone is invited to work. Everyone is invited to play. We make the world real through actions that open the heart.",
  "Immediate experience is, in many ways, the most important touchstone of value in our culture. We seek to overcome barriers that stand between us and a recognition of our inner selves, the reality of those around us, participation in society, and contact with a natural world exceeding human powers. No idea can substitute for this experience.",
].map((text, index) => ({ name: `principle-${index + 1}`, text }));

export const CodeOfConductRF: React.FC = () => {
  const returnUrl = useSearchParam("returnUrl") ?? undefined;
  const history = useHistory();
  const { userId } = useUser();
  const venueId = useVenueId();
  // const { currentVenue: venue } = useConnectCurrentVenueNG(venueId);

  const { register, handleSubmit, errors, formState } = useForm<
    Record<string, boolean>
  >({ mode: "onChange" });

  // @debt Should we throw an error here rather than defaulting to empty string?
  const proceed = useCallback(
    () => history.push(venueId ? venueInsideUrl(venueId) : returnUrl ?? ""),
    [history, returnUrl, venueId]
  );

  const codeOfConductQuestions =
    // venue?.code_of_conduct_questions?.length
    // ? venue?.code_of_conduct_questions
    // :
    TEN_PRINCIPLES_OF_BURNING_MAN;

  useEffect(() => {
    // Skip this screen if there are no code of conduct questions for the venue
    if (!codeOfConductQuestions?.length) {
      proceed();
    }
  }, [proceed, codeOfConductQuestions]);

  const [{ loading: isUpdating, error: httpError }, onSubmit] = useAsyncFn(
    async (data) => {
      if (!userId) return;
      const tenPrinciples =
        Object.values(data).filter(isTruthy).length ===
        codeOfConductQuestions?.length;
      // NOTE: only care about 10 principles for BM
      await updateUserProfile(userId, ({
        tenPrinciples,
      } as unknown) as CodeOfConductFormData);
      proceed();
    },
    [proceed, userId, codeOfConductQuestions]
  );

  if (!venueId) {
    console.error(
      CodeOfConductRF.name,
      "Error: Missing required venueId param"
    );
    return <NotFound fullScreen />;
  }

  // NOTE: needless to check venue if venue?.code_of_conduct_questions isn't used
  // if (!venue) {
  //   return isLoaded(venue) ? <NotFound fullScreen /> : <LoadingPage />;
  // }

  return (
    <PaneRF className="CodeOfConductRF">
      <DivRF variant="title">10 principles of Burning Man</DivRF>
      <DivRF variant="subtitle">
        They are the community’s ethos and culture as it had organically
        developped since the event’s inception. Please read and check them.
      </DivRF>
      <form onSubmit={handleSubmit(onSubmit)} className="mod--flex-col">
        <DivRF className="CodeOfConductRF__bullets mod--flex-col">
          {codeOfConductQuestions.map(({ name, text }) => (
            <CheckboxWrapRF
              key={name}
              label={text}
              error={errors[name]?.type === "required" && "Required"}
            >
              <input
                type="checkbox"
                name={name}
                ref={register({
                  required: true,
                })}
              />
            </CheckboxWrapRF>
          ))}
        </DivRF>
        <DivRF className="mod--flex-col mod--width-100pp">
          <ButtonNG
            variant="primary"
            type="submit"
            disabled={!formState.isValid || isUpdating}
            loading={isUpdating}
          >
            Next
          </ButtonNG>
          <Loading displayWhile={isUpdating} />
          <SpanRF variant="error">{httpError?.message}</SpanRF>
        </DivRF>
      </form>
    </PaneRF>
  );
};
