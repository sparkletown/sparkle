import React from "react";
import { ErrorMessage, useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import { updateBanner } from "api/bannerAdmin";

import { Banner } from "types/banner";

import { ButtonNG } from "components/atoms/ButtonNG";
import { InputField } from "components/atoms/InputField";

import "./RunTabToolbar.scss";

export interface RunTabToolbarProps {
  venueId?: string;
  venueName: string;
  announcement?: Banner;
}

export const RunTabToolbar: React.FC<RunTabToolbarProps> = ({
  venueId,
  venueName,
  announcement,
}) => {
  const { register, getValues } = useForm<{
    message: string;
  }>({
    mode: "onSubmit",
  });

  const [
    { loading: isUpdatingBanner, error },
    updateBannerAsync,
  ] = useAsyncFn(async () => {
    if (!venueId) return;
    const bannerMessage = getValues().message;
    await updateBanner({ venueId, banner: { content: bannerMessage } });
  }, [getValues, venueId]);

  return (
    <div className="RunTabToolbar__wrapper">
      <form className="RunTabToolbar__toolbar RunTabToolbar__toolbar--left RunTabToolbar__form">
        <InputField
          disabled={isUpdatingBanner}
          containerClassName="RunTabToolbar__announce"
          inputClassName="mod--text-left"
          defaultValue={announcement?.content}
          ref={register({ required: true })}
          name="message"
          placeholder="Announcement..."
          autoComplete="off"
        />
        <ButtonNG
          disabled={isUpdatingBanner}
          loading={isUpdatingBanner}
          iconName={faPaperPlane}
          iconOnly={true}
          onClick={updateBannerAsync}
        />
        {error && <ErrorMessage name={error.message} message={error.message} />}
      </form>
    </div>
  );
};
