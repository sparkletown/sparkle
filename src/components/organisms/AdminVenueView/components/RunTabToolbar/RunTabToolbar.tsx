import React from "react";
import { useForm } from "react-hook-form";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import { makeUpdateBanner } from "api/bannerAdmin";

import { venueInsideUrl } from "utils/url";

import { InputField } from "components/atoms/InputField";
import { ButtonNG } from "components/atoms/ButtonNG/ButtonNG";

import "./RunTabToolbar.scss";
import { useAsyncFn } from "react-use";

export interface RunTabToolbarProps {
  venueId?: string;
}

const noop = () => undefined;

export const RunTabToolbar: React.FC<RunTabToolbarProps> = ({ venueId }) => {
  const { register, getValues } = useForm<{
    message: string;
  }>({
    mode: "onSubmit",
  });

  const [{ loading: isUpdatingBanner }, updateBanner] = useAsyncFn(async () => {
    if (!venueId) return;
    const bannerMessage = getValues().message;
    await makeUpdateBanner(venueId, noop)(bannerMessage);
  }, [getValues, venueId]);

  return (
    <div className="RunTabToolbar__wrapper">
      <form
        className="RunTabToolbar__toolbar RunTabToolbar__toolbar--left RunTabToolbar__form"
        onSubmit={noop}
      >
        <InputField
          disabled={isUpdatingBanner}
          containerClassName="RunTabToolbar__input RunTabToolbar__announce"
          inputClassName="mod--text-left"
          ref={register({ required: true })}
          name="message"
          placeholder="Announcement..."
          autoComplete="off"
        />
        <ButtonNG
          disabled={isUpdatingBanner}
          iconName={faPaperPlane}
          iconOnly={true}
          onClick={updateBanner}
        />
      </form>
      <div className="RunTabToolbar__toolbar RunTabToolbar__toolbar--right">
        <ButtonNG
          isLink
          newTab
          linkTo={venueId ? venueInsideUrl(venueId) : undefined}
          variant="primary"
        >
          Visit Space
        </ButtonNG>
      </div>
    </div>
  );
};
