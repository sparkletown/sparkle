import React from "react";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import { makeUpdateBanner } from "api/bannerAdmin";

import { venueInsideUrl } from "utils/url";

import { InputField } from "components/atoms/InputField";
import { ButtonNG } from "components/atoms/ButtonNG/ButtonNG";

import "./RunTabToolbar.scss";

export interface RunTabToolbarProps {
  venueId?: string;
}

export const RunTabToolbar: React.FC<RunTabToolbarProps> = ({ venueId }) => {
  const { register, getValues } = useForm<{
    message: string;
  }>({
    mode: "onSubmit",
  });

  const [{ loading: isUpdatingBanner }, updateBanner] = useAsyncFn(async () => {
    if (!venueId) return;
    const bannerMessage = getValues().message;
    await makeUpdateBanner(venueId)(bannerMessage);
  }, [getValues, venueId]);

  return (
    <div className="RunTabToolbar__wrapper">
      <form className="RunTabToolbar__toolbar RunTabToolbar__toolbar--left RunTabToolbar__form">
        <InputField
          disabled={isUpdatingBanner}
          containerClassName="RunTabToolbar__announce"
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
