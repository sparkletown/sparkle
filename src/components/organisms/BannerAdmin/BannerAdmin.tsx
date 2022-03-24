import React, { useCallback, useEffect } from "react";
import { useForm, useFormState } from "react-hook-form";
import { useAsyncFn } from "react-use";
import classNames from "classnames";
import { InputField } from "components/attendee/InputField";

import { updateBanner } from "api/bannerAdmin";

import { Banner } from "types/banner";
import { AnyVenue } from "types/venues";

import { useShowHide } from "hooks/useShowHide";

import { ButtonNG } from "components/atoms/ButtonNG";
import { Checkbox } from "components/atoms/Checkbox";
import { ConfirmationModal } from "components/atoms/ConfirmationModal/ConfirmationModal";

import "./BannerAdmin.scss";

interface BannerAdminProps {
  venueId?: string;
  venue: AnyVenue;
  onClose?: () => void;
}

export const BannerAdmin: React.FC<BannerAdminProps> = ({
  venueId,
  venue,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
  } = useForm<Banner>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const { errors } = useFormState({ control });
  const isUrlButtonActive = watch(
    "isActionButton",
    venue?.banner?.isActionButton
  );

  const {
    isShown: isShowBannerChangeModal,
    show: showBannerChangeModal,
    hide: hideBannerChangeModal,
  } = useShowHide();

  const [{ loading: isUpdatingBanner }, saveBanner] = useAsyncFn(
    async (banner?: Banner) => {
      if (!venueId) return;

      await updateBanner({ venueId, banner });
      onClose && onClose();
    },
    [venueId, onClose]
  );

  const clearBanner = useCallback(() => {
    showBannerChangeModal();

    reset();
  }, [showBannerChangeModal, reset]);

  const confirmChangeBannerData = useCallback(() => {
    saveBanner();
    hideBannerChangeModal();
  }, [saveBanner, hideBannerChangeModal]);

  useEffect(() => {
    if (!isUrlButtonActive) {
      setValue("isForceFunnel", false);
    }
  }, [isUrlButtonActive, setValue]);

  const forceFunnelLabelClasses = classNames("BannerAdmin__checkbox__label", {
    BannerAdmin__checkbox__label__disabled: !isUrlButtonActive,
  });

  return (
    <div className="BannerAdmin">
      <form onSubmit={handleSubmit(saveBanner)}>
        <div className="form-group">
          <textarea
            {...register("content", { required: true })}
            defaultValue={venue?.banner?.content}
            className="BannerAdmin__input-text"
            placeholder="Please type your announcement"
          />
          {errors.content && errors.content.type === "required" && (
            <span className="input-error">Display content is required</span>
          )}
        </div>

        <Checkbox
          containerClassName="BannerAdmin__checkbox BannerAdmin__checkbox--action"
          labelClassName="BannerAdmin__checkbox__label"
          name="isActionButton"
          label="Call to Action Button"
          toggler
          {...register}
          defaultChecked={venue?.banner?.isActionButton}
        />

        <div className="BannerAdmin__action-container">
          <InputField
            register={register}
            name="buttonUrl"
            placeholder="Button URL"
            defaultValue={venue?.banner?.buttonUrl}
            containerClassName="BannerAdmin__input-container"
            inputClassName="BannerAdmin__input-text"
            disabled={!isUrlButtonActive}
            autoComplete="off"
          />
          <InputField
            register={register}
            name="buttonDisplayText"
            placeholder="Button display text"
            defaultValue={venue?.banner?.buttonDisplayText}
            containerClassName="BannerAdmin__input-container"
            inputClassName="BannerAdmin__input-text"
            disabled={!isUrlButtonActive}
            autoComplete="off"
          />
        </div>
        <Checkbox
          {...register}
          containerClassName="BannerAdmin__checkbox"
          labelClassName="BannerAdmin__checkbox__label"
          name="isFullScreen"
          label="Set fullscreen announcement"
          toggler
          defaultChecked={venue?.banner?.isFullScreen}
        />

        <Checkbox
          {...register}
          containerClassName="BannerAdmin__checkbox"
          labelClassName={forceFunnelLabelClasses}
          name="isForceFunnel"
          label="Force funnel (users will have to click your button)"
          toggler
          defaultChecked={venue?.banner?.isForceFunnel}
          disabled={!isUrlButtonActive}
        />

        <div className="BannerAdmin__button-container">
          <ButtonNG
            className="BannerAdmin__button BannerAdmin__button--close"
            onClick={clearBanner}
            disabled={isUpdatingBanner}
          >
            Clear banner
          </ButtonNG>
          <ButtonNG
            className="BannerAdmin__button"
            type="submit"
            disabled={isUpdatingBanner}
            variant="primary"
          >
            Save
          </ButtonNG>
        </div>
      </form>

      <ConfirmationModal
        show={isShowBannerChangeModal}
        onConfirm={confirmChangeBannerData}
        onCancel={hideBannerChangeModal}
        header="Erase your beautiful work?"
        message="Are you sure you want to clear this banner?"
        saveBtnLabel="Yes, clear"
        cancelBtnLabel="Cancel"
        confirmVariant="danger"
      />
    </div>
  );
};
