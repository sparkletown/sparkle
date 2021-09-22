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

import { IS_BURN } from "secrets";

import {
  DEFAULT_VENUE_BANNER,
  DEFAULT_VENUE_LOGO,
  PLAYA_HEIGHT,
  PLAYA_IMAGE,
  PLAYA_VENUE_NAME,
  PLAYA_VENUE_SIZE,
  PLAYA_VENUE_STYLES,
  PLAYA_WIDTH,
} from "settings";

import {
  createUrlSafeName,
  createVenue,
  updateVenue,
  VenueInput,
} from "api/admin";

import { setSovereignVenue } from "store/actions/SovereignVenue";

import { UserStatus } from "types/User";
import { ExtractProps } from "types/utility";
import { VenuePlacementState } from "types/venues";

import { isTruthy } from "utils/types";

import { useDispatch } from "hooks/useDispatch";
import { useQuery } from "hooks/useQuery";
import { useSovereignVenue } from "hooks/useSovereignVenue";
import { useUser } from "hooks/useUser";

import { PlayaContainer } from "pages/Account/Venue/VenueMapEdition";
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

const iconPositionFieldName = "iconPosition";

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

  const dispatch = useDispatch();
  const { sovereignVenueId, sovereignVenue } = useSovereignVenue({ venueId });

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
      bannerImageUrl: defaultValues?.bannerImageUrl ?? DEFAULT_VENUE_BANNER,
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
                profile_questions: sovereignVenue.profile_questions,
                code_of_conduct_questions:
                  sovereignVenue.code_of_conduct_questions,
                userStatuses,
                showUserStatus: showUserStatuses,
                template: sovereignVenue.template,
              },
              user
            ).then(() => {
              if (sovereignVenue) {
                dispatch(
                  setSovereignVenue({
                    ...sovereignVenue,
                    userStatuses,
                    showUserStatus: showUserStatuses,
                  })
                );
              }
            });
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
          ? history.push(`/admin/${createUrlSafeName(venueId ?? vals.name)}`)
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
    [
      user,
      formError,
      venueId,
      history,
      sovereignVenueId,
      sovereignVenue,
      dispatch,
    ]
  );

  const iconsMap = useMemo(
    () => ({
      [iconPositionFieldName]: {
        width: PLAYA_VENUE_SIZE,
        height: PLAYA_VENUE_SIZE,
        top: defaultValues?.placement?.y ?? 0,
        left: defaultValues?.placement?.x ?? 0,
      },
    }),
    [defaultValues]
  );

  const onBoxMove: ExtractProps<
    typeof PlayaContainer
  >["onChange"] = useCallback(
    (val) => {
      if (!(iconPositionFieldName in val)) return;
      const iconPos = val[iconPositionFieldName];
      setValue("placement", {
        x: iconPos.left,
        y: iconPos.top,
      });
    },
    [setValue]
  );

  useEffect(() => {
    if (!previous || isTruthy(state.templatePage)) return;

    previous();
  }, [previous, state.templatePage]);

  if (!state.templatePage) {
    // In reality users should never actually see this, since the useEffect above should navigate us back to ?page=1
    return <>Error: state.templatePage not defined.</>;
  }

  const isAdminPlaced =
    state.detailsPage?.venue?.placement?.state ===
    VenuePlacementState.AdminPlaced;
  const placementAddress = state.detailsPage?.venue?.placement?.addressText;

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
      {IS_BURN && (
        <div className="page-side preview" style={{ paddingBottom: "20px" }}>
          <h4
            className="italic"
            style={{ textAlign: "center", fontSize: "22px" }}
          >
            Position your venue on the {PLAYA_VENUE_NAME}
          </h4>
          {isAdminPlaced ? (
            <p className="warning">
              Your venue has been placed by our placement team and cannot be
              moved.{" "}
              {placementAddress && (
                <>
                  The placement team wrote your address as: {placementAddress}
                </>
              )}
            </p>
          ) : (
            <p>
              First upload or select the icon you would like to appear on the
              {PLAYA_VENUE_NAME}, then drag it around to position it. The
              placement team from SparkleVerse will place your camp later, after
              which you will need to reach out if you want it moved.
            </p>
          )}
          <div
            className="playa"
            ref={placementDivRef}
            style={{ width: "100%", height: 1000, overflow: "scroll" }}
          >
            <PlayaContainer
              rounded
              interactive={!isAdminPlaced}
              resizable={false}
              coordinatesBoundary={{
                width: PLAYA_WIDTH,
                height: PLAYA_HEIGHT,
              }}
              onChange={onBoxMove}
              snapToGrid={false}
              iconsMap={iconsMap ?? {}}
              backgroundImage={PLAYA_IMAGE}
              iconImageStyle={PLAYA_VENUE_STYLES.iconImage}
              draggableIconImageStyle={PLAYA_VENUE_STYLES.draggableIconImage}
              venueId={venueId}
              otherIconsStyle={{ opacity: 0.4 }}
              containerStyle={{
                width: PLAYA_WIDTH,
                height: PLAYA_HEIGHT,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
