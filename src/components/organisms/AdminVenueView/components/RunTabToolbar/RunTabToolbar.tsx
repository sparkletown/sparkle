import React, { useCallback } from "react";
import { ErrorMessage, useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { useAsyncFn } from "react-use";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import { updateBanner } from "api/bannerAdmin";

import { venueInsideUrl } from "utils/url";

import { useShowHide } from "hooks/useShowHide";

import VenueDeleteModal from "pages/Admin/Venue/VenueDeleteModal";

import { ButtonNG } from "components/atoms/ButtonNG";
import { InputField } from "components/atoms/InputField";

import "./RunTabToolbar.scss";

export interface RunTabToolbarProps {
  venueId?: string;
  venueName: string;
}

export const RunTabToolbar: React.FC<RunTabToolbarProps> = ({
  venueId,
  venueName,
}) => {
  const { register, getValues } = useForm<{
    message: string;
  }>({
    mode: "onSubmit",
  });

  const {
    isShown: isDeleteModalShown,
    show: showDeleteModal,
    hide: closeDeleteModal,
  } = useShowHide();
  const history = useHistory();

  const navigateToAdmin = useCallback(() => {
    history.push("/admin-ng");
  }, [history]);

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
          ref={register({ required: true })}
          name="message"
          placeholder="Announcement..."
          autoComplete="off"
        />
        <ButtonNG
          disabled={isUpdatingBanner}
          iconName={faPaperPlane}
          iconOnly={true}
          onClick={updateBannerAsync}
        />
        {error && <ErrorMessage name={error.message} message={error.message} />}
      </form>
      <div className="RunTabToolbar__toolbar RunTabToolbar__toolbar--right">
        <ButtonNG variant="danger" onClick={showDeleteModal}>
          Delete Space
        </ButtonNG>
        <ButtonNG
          isLink
          newTab
          linkTo={venueId ? venueInsideUrl(venueId) : undefined}
          variant="primary"
        >
          Visit Space
        </ButtonNG>
      </div>
      <VenueDeleteModal
        venueId={venueId}
        venueName={venueName}
        show={isDeleteModalShown}
        onDelete={navigateToAdmin}
        onHide={closeDeleteModal}
        onCancel={closeDeleteModal}
      />
    </div>
  );
};
