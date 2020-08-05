import React, { useCallback, useMemo } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import "firebase/functions";
import { useUser } from "hooks/useUser";
import { VenueInput, createUrlSafeName, createVenue } from "api/admin";
import { WizardPage } from "./VenueWizard";
import "./Venue.scss";
import * as Yup from "yup";
import { ImageInput } from "components/molecules/ImageInput";
import { validationSchema } from "./DetailsValidationSchema";
import { Accordion, useAccordionToggle } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { AdvancedDetailsForm } from "./AdvancedDetailsForm";
import { EntranceExperiencePreviewProvider } from "components/templates/EntranceExperienceProvider";
import { ExtractProps } from "types/utility";
import { VenueTemplate } from "types/VenueTemplate";
import { venueDefaults } from "./defaults";

const LONG_DESCRIPTION_PLACEHOLDER =
  "Describe what is unique and wonderful and sparkling about your venue";

type FormValues = Partial<Yup.InferType<typeof validationSchema>>; // bad typing. If not partial, react-hook-forms should force defaultValues to conform to FormInputs but it doesn't

export const DetailsForm: React.FC<WizardPage> = ({ previous, state }) => {
  const { watch, formState, ...rest } = useForm<FormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema,
    validationContext: state.templatePage,
    defaultValues: {},
  });
  const { user } = useUser();
  const { isSubmitting } = formState;
  const values = watch();
  const onSubmit = useCallback(
    async (vals: Partial<VenueInput>) => {
      if (!user) return;
      const values = vals as VenueInput; // unfortunately the typing is off for react-hook-forms.
      try {
        await createVenue(values, user);
      } catch (e) {
        console.error(e);
      }
    },
    [user]
  );

  const onFormSubmit = rest.handleSubmit(onSubmit);

  if (!state.templatePage) {
    previous && previous();
    return null;
  }

  return (
    <div className="page">
      <div className="page-side">
        <div className="page-container-left">
          <div className="page-container-left-content">
            <DetailsFormLeft
              state={state}
              previous={previous}
              values={values}
              isSubmitting={isSubmitting}
              {...rest}
              onSubmit={onFormSubmit}
            />
          </div>
        </div>
      </div>
      <div className="page-side preview">
        <VenuePreview values={values} />
      </div>
    </div>
  );
};

type Venue = ExtractProps<typeof EntranceExperiencePreviewProvider>["venue"];

interface VenuePreviewProps {
  values: FormValues;
}

const VenuePreview: React.FC<VenuePreviewProps> = ({ values }) => {
  const urlFromImage = useCallback(
    (files?: FileList) =>
      files && files.length > 0 ? URL.createObjectURL(files[0]) : undefined,
    []
  );

  const previewVenue: Venue = useMemo(
    () => ({
      template: VenueTemplate.jazzbar,
      name: values.name || venueDefaults.name,
      config: {
        theme: venueDefaults.config.theme,
        landingPageConfig: {
          coverImageUrl:
            urlFromImage(values.bannerImageFile) ??
            venueDefaults.config.landingPageConfig.coverImageUrl,
          subtitle:
            values.tagline || venueDefaults.config.landingPageConfig.subtitle,
          presentation: venueDefaults.config.landingPageConfig.presentation,
          checkList: venueDefaults.config.landingPageConfig.checkList,
          videoIframeUrl: venueDefaults.config.landingPageConfig.videoIframeUrl,
          joinButtonText: venueDefaults.config.landingPageConfig.joinButtonText,
          quotations: venueDefaults.config.landingPageConfig.quotations,
        },
      },
      host: {
        icon: urlFromImage(values.logoImageFile) ?? venueDefaults.host.icon,
      },
      profile_questions:
        values.profileQuestions ?? venueDefaults.profile_questions,
      code_of_conduct_questions: venueDefaults.code_of_conduct_questions,
    }),
    [values, urlFromImage]
  );

  return (
    <div className="venue-preview">
      <EntranceExperiencePreviewProvider
        venueRequestStatus
        venue={previewVenue}
      />
    </div>
  );
};

interface DetailsFormLeftProps {
  state: WizardPage["state"];
  previous: WizardPage["previous"];
  values: FormValues;
  isSubmitting: boolean;
  register: ReturnType<typeof useForm>["register"];
  control: ReturnType<typeof useForm>["control"];
  onSubmit: ReturnType<ReturnType<typeof useForm>["handleSubmit"]>;
  errors: FieldErrors<FormValues>;
}

const DetailsFormLeft: React.FC<DetailsFormLeftProps> = (props) => {
  const {
    state,
    values,
    isSubmitting,
    register,
    errors,
    control,
    previous,
    onSubmit,
  } = props;
  // would be nice to access this from the form context but can't find a way
  const isNonMapTemplate =
    state.templatePage?.template.type === "ZOOM_ROOM" ||
    state.templatePage?.template.type === "PERFORMANCE_VENUE";

  const urlSafeName = values.name
    ? `${window.location.host}/v/${createUrlSafeName(values.name)}`
    : undefined;
  const disable = isSubmitting;
  const templateType = state.templatePage?.template.name;

  return (
    <form className="full-height-container" onSubmit={onSubmit}>
      <div className="scrollable-content">
        <h4 className="italic">{`Create your ${templateType}`}</h4>
        <p className="small light" style={{ marginBottom: "2rem" }}>
          You can change anything except for the name of your venue later
        </p>
        <div className="input-container">
          <div className="input-title">Name your venue</div>
          <input
            disabled={disable}
            name="name"
            ref={register}
            className="align-left"
            style={{ marginBottom: "1rem" }}
            placeholder={`My ${templateType} name`}
          />
          {errors.name ? (
            <span className="input-error">{errors.name.message}</span>
          ) : urlSafeName ? (
            <span className="input-info">
              The URL of your venue will be: <b>{urlSafeName}</b>
            </span>
          ) : null}
        </div>
        {isNonMapTemplate && (
          <div className="input-container">
            <div className="input-title">
              {`Choose how you'd like your venue to appear on the map`}
            </div>
            <ImageInput
              disabled={disable}
              name={"mapIconImageFile"}
              containerClassName="input-square-container"
              imageClassName="input-square-image"
              image={values.mapIconImageFile}
              ref={register}
              error={errors.mapIconImageFile}
            />
          </div>
        )}
        <div className="input-container">
          <div className="input-title">Upload a banner photo</div>
          <ImageInput
            disabled={disable}
            name={"bannerImageFile"}
            image={values.bannerImageFile}
            ref={register}
            error={errors.bannerImageFile}
          />
        </div>
        <div className="input-container">
          <div className="input-title">Upload a square logo</div>
          <ImageInput
            disabled={disable}
            ref={register}
            image={values.logoImageFile}
            name={"logoImageFile"}
            containerClassName="input-square-container"
            imageClassName="input-square-image"
            error={errors.logoImageFile}
          />
        </div>
        <div className="input-container">
          <div className="input-title">The venue tagline</div>
          <input
            disabled={disable}
            name={"tagline"}
            ref={register}
            className="wide-input-block align-left"
            placeholder="Briefly say what people will find here"
          />
          {errors.tagline && (
            <span className="input-error">{errors.tagline.message}</span>
          )}
        </div>
        <div className="input-container">
          <div className="input-title">Long description</div>
          <textarea
            disabled={disable}
            name={"longDescription"}
            ref={register}
            className="wide-input-block input-centered align-left"
            placeholder={LONG_DESCRIPTION_PLACEHOLDER}
          />
          {errors.longDescription && (
            <span className="input-error">
              {errors.longDescription.message}
            </span>
          )}
        </div>
        <Accordion>
          <AccordionButton eventKey="0" />
          <Accordion.Collapse eventKey="0">
            <AdvancedDetailsForm
              register={register}
              control={control}
              values={values}
              errors={errors}
            />
          </Accordion.Collapse>
        </Accordion>
      </div>
      <div className="page-container-left-bottombar">
        <button className="btn btn-primary nav-btn" onClick={previous}>
          Go Back
        </button>
        <div>
          <SubmitButton isSubmitting={isSubmitting} />
        </div>
      </div>
    </form>
  );
};

interface AccordionButtonProps {
  eventKey: string;
}

const AccordionButton: React.FC<AccordionButtonProps> = ({ eventKey }) => {
  const decoratedOnClick = useAccordionToggle(eventKey, () => {});
  return (
    <div className="advanced-toggle centered-flex" onClick={decoratedOnClick}>
      <FontAwesomeIcon icon={faCaretDown} size="lg" />
      <span className="toggle-title">Advanced Options</span>
    </div>
  );
};

interface SubmitButtonProps {
  isSubmitting: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting }) => {
  return isSubmitting ? (
    <div className="spinner-border">
      <span className="sr-only">Loading...</span>
    </div>
  ) : (
    <input className="btn btn-primary" type="submit" value="Create venue" />
  );
};
