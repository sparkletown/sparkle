import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import Bugsnag from "@bugsnag/js";
import * as Yup from "yup";

import { DEFAULT_VENUE_LOGO } from "settings";

import { createSlug, createVenue, updateVenue, VenueInput } from "api/admin";

import { UserStatus } from "types/User";

import { isTruthy } from "utils/types";

import { useQuery } from "hooks/useQuery";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useUser } from "hooks/useUser";

import { VenueDetailsSubForm } from "pages/Admin/Venue/VenueDetailsSubForm";

import "firebase/functions";

import {
  editVenueCastSchema,
  validationSchema,
} from "./DetailsValidationSchema";
import { WizardPage } from "./VenueWizard";

// @debt refactor any needed styles out of this file (eg. toggles, etc) and into DetailsForm.scss/similar, then remove this import
import "../Admin.scss";
import "./Venue.scss";

export type FormValues = Partial<Yup.InferType<typeof validationSchema>>; // bad typing. If not partial, react-hook-forms should force defaultValues to conform to FormInputs but it doesn't

interface DetailsFormProps extends WizardPage {
  venueId?: string;
}

export const VenueDetailsForm: React.FC<DetailsFormProps> = ({
  previous,
  state,
  venueId,
}) => {
  const defaultValues = useMemo(
    () =>
      venueId
        ? editVenueCastSchema.cast(state.detailsPage?.venue)
        : validationSchema.cast(),
    [state.detailsPage, venueId]
  );

  const queryParams = useQuery();
  const parentIdQuery = queryParams.get("parentId");

  const { sovereignVenueId, sovereignVenue } = useRelatedVenues();

  const {
    watch,
    formState,
    register,
    setValue,
    control,
    handleSubmit,
    errors,
    setError,
  } = useForm<FormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema: validationSchema,
    validationContext: {
      template: state.templatePage?.template,
      editing: !!venueId,
    },
    defaultValues: {
      ...defaultValues,
      logoImageUrl: defaultValues?.logoImageUrl ?? DEFAULT_VENUE_LOGO,
      bannerImageUrl: defaultValues?.bannerImageUrl ?? "",
      parentId: parentIdQuery ?? defaultValues?.parentId ?? "",
    },
  });
  const { user } = useUser();
  const history = useHistory();
  const { isSubmitting } = formState;

  const [formError, setFormError] = useState(false);

  //register the icon position data
  useEffect(() => {
    register("placement");
  }, [register]);

  const placementDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clientWidth = placementDivRef.current?.clientWidth ?? 0;
    const clientHeight = placementDivRef.current?.clientHeight ?? 0;

    placementDivRef.current?.scrollTo(
      (state?.detailsPage?.venue.placement?.x ?? 0) - clientWidth / 2,
      (state?.detailsPage?.venue.placement?.y ?? 0) - clientHeight / 2
    );
  }, [state]);

  // @debt refactor this to split it into more manageable chunks, most likely with some things pulled into the api/* layer
  // @debt refactor this to use useAsync or useAsyncFn as appropriate
  const onSubmit = useCallback(
    async (
      vals: Partial<FormValues>,
      userStatuses: UserStatus[],
      showUserStatuses: boolean
    ) => {
      if (!user || formError) return;

      try {
        // unfortunately the typing is off for react-hook-forms.
        if (venueId) {
          await updateVenue(
            {
              ...(vals as VenueInput),
              id: venueId,
              userStatuses,
              showUserStatus: showUserStatuses,
            },
            user
          );

          //@debt Create separate function that updates the userStatuses separately by venue id.
          if (
            sovereignVenueId &&
            sovereignVenue &&
            sovereignVenueId !== venueId
          )
            await updateVenue(
              {
                id: sovereignVenueId,
                name: sovereignVenue.name,
                subtitle:
                  sovereignVenue.config?.landingPageConfig.subtitle ?? "",
                description:
                  sovereignVenue.config?.landingPageConfig.description ?? "",
                adultContent: sovereignVenue.adultContent ?? false,
                userStatuses,
                showUserStatus: showUserStatuses,
                template: sovereignVenue.template,
                roomVisibility: sovereignVenue.roomVisibility,
              },
              user
            );
        } else
          await createVenue(
            {
              ...vals,
              userStatuses,
              showUserStatus: showUserStatuses,
            } as VenueInput,
            user
          );

        vals.name
          ? history.push(`/admin/${createSlug(venueId ?? vals.name)}`)
          : history.push(`/admin`);
      } catch (e) {
        setFormError(true);
        Bugsnag.notify(e, (event) => {
          event.addMetadata("Admin::Venue::DetailsForm::onSubmit", {
            venueId,
            vals,
          });
        });
      }
    },
    [user, formError, venueId, history, sovereignVenueId, sovereignVenue]
  );

  useEffect(() => {
    if (!previous || isTruthy(state.templatePage)) return;

    previous();
  }, [previous, state.templatePage]);

  if (!state.templatePage) {
    // In reality users should never actually see this, since the useEffect above should navigate us back to ?page=1
    return <>Error: state.templatePage not defined.</>;
  }

  // @debt refactor any needed styles out of Admin.scss (eg. toggles, etc) and into DetailsForm.scss/similar, then remove the admin-dashboard class from this container
  return (
    <div className="page page--admin admin-dashboard">
      <div className="page-side page-side--admin">
        <div className="page-container-left page-container-left">
          <div className="page-container-left-content">
            <VenueDetailsSubForm
              venueId={venueId}
              setValue={setValue}
              state={state}
              previous={previous}
              sovereignVenue={sovereignVenue}
              isSubmitting={isSubmitting}
              register={register}
              watch={watch}
              onSubmit={onSubmit}
              editing={!!venueId}
              formError={formError}
              setFormError={setFormError}
              control={control}
              handleSubmit={handleSubmit}
              errors={errors}
              setError={setError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
