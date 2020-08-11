import {
  createUrlSafeName,
  createVenue,
  updateVenue,
  VenueInput,
  VenueInputEdit,
} from "api/admin";
import { ImageInput } from "components/molecules/ImageInput";
import "firebase/functions";
import { useUser } from "hooks/useUser";
import React, { useCallback, useMemo } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { createJazzbar } from "types/Venue";
import * as Yup from "yup";
import VenuePreview from "../../../components/organisms/VenuePreview";
import {
  editVenueCastSchema,
  editVenueValidationSchema,
  validationSchema,
} from "./DetailsValidationSchema";
import "./Venue.scss";
import { WizardPage } from "./VenueWizard";

type CreateFormValues = Partial<Yup.InferType<typeof validationSchema>>; // bad typing. If not partial, react-hook-forms should force defaultValues to conform to FormInputs but it doesn't
type EditFormValues = Partial<Yup.InferType<typeof editVenueValidationSchema>>; // bad typing. If not partial, react-hook-forms should force defaultValues to conform to FormInputs but it doesn't

export type FormValues = CreateFormValues | EditFormValues;

interface DetailsFormProps extends WizardPage {
  editing?: boolean;
}

export const DetailsForm: React.FC<DetailsFormProps> = ({
  previous,
  state,
  editing,
}) => {
  const defaultValues = useMemo(
    () => editVenueCastSchema.cast(state.detailsPage?.venue),
    [state.detailsPage]
  );

  const { watch, formState, ...rest } = useForm<FormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    validationSchema: editing ? editVenueValidationSchema : validationSchema,
    validationContext: state.templatePage,
    defaultValues,
  });
  const { user } = useUser();
  const history = useHistory();
  const { isSubmitting } = formState;
  const values = watch();
  const onSubmit = useCallback(
    async (vals: Partial<FormValues>) => {
      console.log("vals", vals);
      if (!user) return;
      try {
        // unfortunately the typing is off for react-hook-forms.
        if (editing) await updateVenue(vals as VenueInputEdit, user);
        else await createVenue(vals as VenueInput, user);
        history.push("/admin");
      } catch (e) {
        console.error(e);
      }
    },
    [user, editing, history]
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
              editing={editing}
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

interface DetailsFormLeftProps {
  state: WizardPage["state"];
  previous: WizardPage["previous"];
  values: FormValues;
  isSubmitting: boolean;
  register: ReturnType<typeof useForm>["register"];
  control: ReturnType<typeof useForm>["control"];
  onSubmit: ReturnType<ReturnType<typeof useForm>["handleSubmit"]>;
  errors: FieldErrors<FormValues>;
  editing?: boolean;
}

const DetailsFormLeft: React.FC<DetailsFormLeftProps> = (props) => {
  const {
    editing,
    state,
    values,
    isSubmitting,
    register,
    errors,
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

  const defaultVenue = createJazzbar({});

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
              remoteUrlInputName={"mapIconImageUrl"}
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
            remoteUrlInputName={"bannerImageUrl"}
            remoteImageUrl={
              "bannerImageUrl" in values ? values.bannerImageUrl : undefined // true if editing
            }
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
            remoteUrlInputName={"logoImageUrl"}
            remoteImageUrl={
              "logoImageUrl" in values ? values.logoImageUrl : undefined // true if editing
            }
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
            placeholder={defaultVenue.config.landingPageConfig.subtitle}
          />
          {errors.subtitle && (
            <span className="input-error">{errors.subtitle.message}</span>
          )}
        </div>
        <div className="input-container">
          <div className="input-title">Long description</div>
          <textarea
            disabled={disable}
            name={"longDescription"}
            ref={register}
            className="wide-input-block input-centered align-left"
            placeholder={defaultVenue.config.landingPageConfig.description}
          />
          {errors.description && (
            <span className="input-error">{errors.description.message}</span>
          )}
        </div>
      </div>
      <div className="page-container-left-bottombar">
        {previous ? (
          <button className="btn btn-primary nav-btn" onClick={previous}>
            Go Back
          </button>
        ) : (
          <div />
        )}
        <div>
          <SubmitButton editing={editing} isSubmitting={isSubmitting} />
        </div>
      </div>
    </form>
  );
};

interface AccordionButtonProps {
  eventKey: string;
}

interface SubmitButtonProps {
  isSubmitting: boolean;
  editing?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isSubmitting,
  editing,
}) => {
  return isSubmitting ? (
    <div className="spinner-border">
      <span className="sr-only">Loading...</span>
    </div>
  ) : (
    <input
      className="btn btn-primary"
      type="submit"
      value={editing ? "Update venue" : "Create venue"}
    />
  );
};
